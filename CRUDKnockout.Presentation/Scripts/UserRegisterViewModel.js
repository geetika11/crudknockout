var UserRegisterViewModel;
var grid;
var dataView;

//add the user
function User(Name, Address, Age, Gender, PhoneNumber) {
    var self = this;
    self.Name = ko.observable(Name);
    self.Address = ko.observable(Address);
    self.Age = ko.observable(Age);
    self.Gender = ko.observable(Gender);
    self.PhoneNumber = ko.observable(PhoneNumber); 
    self.eligible = ko.observable(true);
    self.addUser = function () {
        var validation_holder = 0;
        var checkNumber = 0;
        var NameValue = $("#Name").val();
        var GenderValue = $("#Gender").val();
        var AddressValue = $("#Address").val();
        var AgeValue = $("#Age").val();
        var NumberValue = $("#PhoneNumber").val();
        var phone_regex = /^[0-9]{10}$/;
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
            if (AgeValue <= 0 || AgeValue>=120) {
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
                    alert('user added successfully')
                }
            });
        }
    };
}

//to search the user
function SearchUsers(SearchString) {
    var self = this;
    self.users = ko.observableArray([]);
    self.SearchString = ko.observable(SearchString);
    self.SearchUser = function () {
        self.users.removeAll();
            $.ajax({
            url: '/api/searchuser/' + self.SearchString(),
            type: 'put',
            contentType: 'application/json',
            success: function (DATA) {
                $.each(DATA, function (key, value) {
                    self.users.push(new User( value.Name, value.Address, value.Age, value.Gender, value.PhoneNumber));
                });
            }//end of success
        })//end of ajax
    }
}

//grid showing all the users
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
            { id: "delete", name: "Action", width: 70, formatter: deleteUser }, //formatter is a function
            { id: "edit", name: "Action", width: 70, formatter: editUser },
            { id: "detail", name: "Detail", width: 70, formatter: detailedUser }
    ];

        //to delete the user
        function deleteUser(row, cell, value, columnDef, dataContext) {
                var button = "<input value='Delete' onclick='DeleteData(" + dataContext.ID + ")' type='button' id='deletebutton'/>";
                return button;
    }

        //to edit the user
        function editUser(row, cell, value, columnDef, dataContext) {
                var button = "<input value='Edit' onclick='EditData(" + JSON.stringify(dataContext) + ")' type='button'  />";
                return button;
    }

        //to get the details of the user
        function detailedUser(row, cell, value, columnDef, dataContext) {
            var button = "<input value='Detail' onclick='Detail(" + JSON.stringify(dataContext) + ")' type='button'  />";
            return button;
    }

        //on click of detail button
        Detail = function (data) {
        UserRegisterViewModel.tempUser = data;
        $.ajax({
            url: '/Home/_RegisterUser',
            type: "post",
            data: ({ ID: data.ID }),
            contenttype: 'application/json',
            success: function (datas) {
                var newdata = '<div class="modal fade" role="dialog" aria-labelledby="mySmallModalLabel" tabindex="-1"style="width:400px;height:500px;align-items:center"> <div class="modal-dialog modal-sm" role="document"><div class="modal-content" data-bind="with: $data.tempUser"><button type="button" class="close" data-dismiss="modal">&times;</button>' + datas + '</div></div></div>';
                var ele = document.getElementById("div1")
                ele.innerHTML = newdata;
                eligible = ko.observable(false);
                addUser = function () { }
                //occurs when the modal is about to be shown
                $("#div1 .modal").on('show.bs.modal', function () {
                    ko.applyBindings(UserRegisterViewModel, $('#div1 .modal')[0]);
                });
                //to open the modal
                $(".fade").modal('show')
                //to disable the mouse
                $(".fade").mouseover(function () { $(this).css("pointer-events","none")})
            },
        })
    }

        //on click of edit button
        EditData = function (data) {
            UserRegisterViewModel.tempUser = data;
            $.ajax({
                url: '/Home/_RegisterUser',
                type: "post",
                data: ({ ID: data.ID}),
                contenttype: 'application/json',
                success: function (datas) {
                    var newdata = '<div class="modal fade"  role="dialog" aria-labelledby="mySmallModalLabel" tabindex="-1"style="width:400px;height:500px;align-items:center"> <div class="modal-dialog modal-sm" role="document"><div class="modal-content" data-bind="with: $data.tempUser"><button type="button" class="close" data-dismiss="modal">&times;</button>' + datas + '<input type="button"  class="btn btn-primary" value="Edit User" data-bind="click: updateuser" /></div></div></div> ';
                    var ele = document.getElementById("div1")
                    ele.innerHTML = newdata;
                    eligible = ko.observable(false);
                    addUser = function () {}
                    updateuser = function () {
                        var dataObject = ko.toJSON(this);
                        $.ajax({
                            url: '/api/edituser/' + data.ID,
                            type:"post",
                            data: dataObject,
                            contentType: 'application/json',
                            success: function (data) {
                                alert('User updated successfully')
                                $(".fade").modal('hide');
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
         //on click of delete button
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
    }; //why to give options and wht do you mean by enalb e cell navigation

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
//assigning the value to the user register view model
UserRegisterViewModel = { searchViewModel: new SearchUsers(), editViewModel: new User(), tempUser: new User() };

//Document Object Model (DOM) is ready for JavaScript code to execute.
$(document).ready(function () {    
    ko.applyBindings(UserRegisterViewModel);
    GridUser();
});