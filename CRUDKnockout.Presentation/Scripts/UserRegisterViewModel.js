var UserRegisterViewModel;
var grid;
var dataView;
function User(Name, Address, Age, Gender, PhoneNumber) {
    var self = this;
    self.Name = ko.observable(Name);
    self.Address = ko.observable(Address);
    self.Age = ko.observable(Age);
    self.Gender = ko.observable(Gender);
    self.PhoneNumber = ko.observable(PhoneNumber);   
    self.addUser = function () {
        var validation_holder = 0;
        var checkNumber = 0;
        var NameValue = $("#Name").val();
        var GenderValue = $("#Gender").val();
        var AddressValue = $("#Address").val();
        var AgeValue = $("#Age").val();
        var NumberValue = $("#PhoneNumber").val();
        var phone_regex = /^[0-9]{4,20}$/;
        var checkAge = 0;
        if (NameValue == '') {
            $("span.nameError").html("Name is required");
            validation_holder = 0;
        }
        else {
            $("span.nameError").html("")
        }
        if (GenderValue == '') {
            $("span.genderError").html("Gender is required");
            validation_holder = 0;
        }
        else {
            $("span.genderError").html("")
        }
        if (AddressValue == '') {
            $("span.addressError").html("Address is required");
            validation_holder = 0;
        }
        else {
            $("span.addressError").html("")
        }
        if (AgeValue == '') {
            $("span.ageError").html("Age is required")
            validation_holder = 0;
        }
        else {
            if (AgeValue <= 0) {
                $("span.ageError").html("Please enter valid age");
                checkAge = 0
            }
            else {
                $("span.ageError").html("")
                checkAge = 1
            }
        }
        if (NumberValue == '') {
            $("span.numberError").html("Number is required");
            validation_holder = 0;
        }
        else {
            if (!phone_regex.test(NumberValue)) { // if invalid phone
                $("span.numberError").html("Invalid Phone Number!");
                validation_holder = 0;
                checkNumber = 0;

            } else {
                $("span.numberError").html("");
                checkNumber = 1
            }
        }
        if (NameValue != '' && GenderValue!='' && AgeValue != '' && AddressValue != '' && NumberValue != '' && checkNumber == 1 && checkAge == 1) {
            validation_holder = 1;
        }

        if (validation_holder == 1) {
            var dataObject = ko.toJSON(this);
            $.ajax({
                url: '/api/user',
                type: 'post',
                data: dataObject,
                contentType: 'application/json',
                success: function (data) {
                    GridUser();
                    self.Name('');
                    self.Address('');
                    self.Age(null);
                    self.Gender('');
                    self.PhoneNumber(null);
                }
            });
        }
    };
}
function SearchUsers(SearchString) {
    var self = this;
    self.users = ko.observableArray([]);
    self.SearchString = ko.observable(SearchString);
    self.SearchUser = function () {
        self.users.removeAll();
        var data = { SearchString: self.SearchString() }

        $.ajax({
            url: '/api/searchuser/' + self.SearchString(),
            type: 'put',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (DATA) {
                $.each(DATA, function (key, value) {
                    self.users.push(new User( value.Name, value.Address, value.Age, value.Gender, value.PhoneNumber));
                });
            }//end of success
        })//end of ajax
    }
}
function GridUser() {    
        var self = this;
        self.Name = ko.observable();
        var grid;
        var columns = [
            { id: "Name", name: "Name", field: "Name" },
            { id: "Address", name: "Address", field: "Address" },
            { id: "Age", name: "Age", field: "Age" },
            { id: "Gender", name: "Gender", field: "Gender" },
            { id: "PhoneNumber", name: "PhoneNumber", field: "PhoneNumber" },
            { id: "delete", name: "Action", width: 70, formatter: buttonFormatter },
            { id: "edit", name: "Action", width: 70, formatter: button1Formatter },
            { id: "detail", name: "Action", width: 70, formatter: button2Formatter }
        ];
        function buttonFormatter(row, cell, value, columnDef, dataContext) {
            var button = "<input value='delete 'class='del' onclick='DeleteData(" + dataContext.ID + ")' type='button' id='deletebutton' />";
            return button;
        }
        function button1Formatter(row, cell, value, columnDef, dataContext) {
            console.log(JSON.stringify(dataContext) + "value of datacontext")
            var button = "<input value='edit 'class='del' onclick='EditData(" + JSON.stringify(dataContext) + ")' type='button'  />";
            return button;
    }
        function button2Formatter(row, cell, value, columnDef, dataContext) {
        console.log(JSON.stringify(dataContext) + "value of datacontext")
        var button = "<input value='Detail 'class='del' onclick='DetailData(" + JSON.stringify(dataContext) + ")' type='button'  />";
        return button;
    }
        DetailData = function (data) {
        self.Name(data.Name);
          //console.log('++++++++++++++++++++' + data.ID)
        UserRegisterViewModel.tempUser = data;
        $.ajax({
            url: '/Home/_RegisterUser',
            type: "post",
            data: ({ ID: data.ID }),
            contenttype: 'application/json',
            success: function (datas) {
                console.log('data beofre addition ', datas)
                var newdata = '<div class="modal fade" role="dialog" aria-labelledby="mySmallModalLabel" tabindex="-1"style="width:400px;height:500px;align-items:center"> <div class="modal-dialog modal-sm" role="document"><div class="modal-content" data-bind="with: $data.tempUser">' + datas + '</div></div></div>';
                var ele = document.getElementById("div1")
                ele.innerHTML = newdata;
                $("#div1 .modal").on('show.bs.modal', function () {
                    ko.applyBindings(UserRegisterViewModel, $('#div1 .modal')[0]);
                });
                $(".fade").modal('show')
            },
        })
    }
        EditData = function (data) {
            UserRegisterViewModel.tempUser = data;
            $.ajax({
                url: '/Home/_RegisterUser',
                type: "post",
                data: ({ ID: data.ID}),
                contenttype: 'application/json',
                success: function (datas) {
                    var newdata = '<div class="modal fade" role="dialog" aria-labelledby="mySmallModalLabel" tabindex="-1"style="width:400px;height:500px;align-items:center"> <div class="modal-dialog modal-sm" role="document"><div class="modal-content" data-bind="with: $data.tempUser"><button type="button" class="close" data-dismiss="modal">&times;</button>' + datas + '<input type="button"  class="btn btn-primary" value="Edit User" data-bind="click: updateuser" /></div></div></div> ';
                    var ele = document.getElementById("div1")
                    ele.innerHTML = newdata;
                    updateuser = function () {
                        var dataObject = ko.toJSON(this);
                        console.log('value of data object iside update user' + dataObject)
                        console.log('ifefkjefk' + data.ID)
                        $.ajax({
                            url: '/api/edituser/' + data.ID,
                            type:"post",
                            data: dataObject,
                            contentType: 'application/json',
                            success: function (data) {
                                console.log('geetika hye')
                            }
                        });
                    }
                    $("#div1 .modal").on('show.bs.modal', function () {
                        ko.applyBindings(UserRegisterViewModel, $('#div1 .modal')[0]);
                    });
                    $(".fade").modal('show')
                   
                },
            })
        }
        DeleteData = function (id) {

            $.ajax({
                url: '/api/deleteuser/' + id,
                type: 'delete',
                contentType: 'application/json',
                success: function () {
                    $.ajax({
                        url: '/Home/_GridTest',
                        type: "post",
                        data: ({ ID: 0 }),
                        success: function (datas) {
                            grid = new Slick.Grid("#myGrid", datas.User, columns, options);
                        }
                    })
                }
            });
        }
        var options = {
            enableCellNavigation: true,
        };
        $(function () {
            $.ajax
                ({
                    url: '/Home/_GridTest',
                    type: "post",
                    data: ({ ID: 0 }),
                    contenttype: 'application/json',
                    success: function (datas) {
                        grid = new Slick.Grid("#myGrid", datas.User, columns, options);
                    }
                })
        })   
}

UserRegisterViewModel = { searchViewModel: new SearchUsers(), editViewModel: new User(), tempUser:new User() };
$(document).ready(function () {    
    ko.applyBindings(UserRegisterViewModel);
   GridUser();
});