﻿var UserRegisterViewModel;
var grid;

function User( Name, Address, Age, Gender, PhoneNumber) {
    var self = this;
      
    self.Name = ko.observable(Name);
    self.Address = ko.observable(Address);
    self.Age = ko.observable(Age);
    self.Gender = ko.observable(Gender);
    self.PhoneNumber = ko.observable(PhoneNumber);
    self.genders = ["Male",
        "Female",
        "Other"
    ];
    self.addUser = function () {
        var validation_holder = 0;
        var checkNumber = 0;
        var NameValue = $("#Name").val();
        var AddressValue = $("#Address").val();
        var AgeValue = $("#Age").val();
        var NumberValue = $("#PhoneNumber").val();
        var phone_regex = /^[0-9]{4,20}$/;
        var checkAge = 0;
        console.log('value of id name1' + NameValue)
        if (NameValue == '') {
            $("span.nameError").html("Name is required");
            validation_holder = 0;
        }
        else {
            $("span.nameError").html("")
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
                checkAge=0
            }
            else {
                $("span.ageError").html("")
                checkAge=1
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
                checkNumber=1
            }
        }
        if (NameValue != '' && AgeValue != '' && AddressValue != '' && NumberValue != '' && checkNumber == 1 && checkAge==1) {
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
                UserRegisterViewModel.UserListViewModel.users.push(new User(data.Name, data.Address, data.Age, data.Gender, data.PhoneNumber));
                GridTest();
                
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
function GridTest() {
    var self = this;
    
    var columns = [
        { id: "Name", name: "Name", field: "Name" },
        { id: "Address", name: "Address", field: "Address" },
        { id: "Age", name: "Age", field: "Age" },
        { id: "Gender", name: "Gender", field: "Gender" },
        { id: "PhoneNumber", name: "PhoneNumber", field: "PhoneNumber" },
        { id: "delete", name: "Action", width: 70, formatter: buttonFormatter },
         { id: "edit", name: "Action", width: 70, formatter: button1Formatter }

    ];
    function buttonFormatter(row, cell, value, columnDef, dataContext) {

        var button = "<input value='delete 'class='del' onclick='DeleteData(" + dataContext.UserID + ")' type='button' id='deletebutton' />";

        return button;
    }
    function button1Formatter(row, cell, value, columnDef, dataContext) {

        var button = "<input value='edit 'class='del' onclick='EditData(" + dataContext.UserID + ")' type='button'  />";
        console.log('data context' + dataContext.Name)

        return button;
    }
    EditData = function (name) {
        var o = new Object();
        console.log('hye entry'+ name);
        $(".fade").modal('show')
        Name = ko.observable();
        Name(name)
        console.log('self.name(id) value ' + Name(name))
       
        $.ajax({
            url: '/Home/_RegisterUser',           
            type: "post",
           data: ({  ID: name }), 
            contenttype: 'application/json',
            success: function (datas) {
                console.log('data after clinet', datas)
                console.log('data before clinet', $("#userList").html(datas)); 

            }, 
            
        })
        console.log('hye');

    }
    DeleteData = function (id) {
        $.ajax({
            url: '/api/deleteuser/' + id,
            type: 'delete',
            contentType: 'application/json',
            success: function () {
                $.getJSON('/api/getallusers', function (data) {
                    grid = new Slick.Grid("#myGrid", data, columns, options);
                })
            }
        });
        data.deleteItem(id);
        data.refresh();
    }

    var options = {
        editable: true,      
        enableCellNavigation: true,
        enableColumnReorder: false
    };
    self.users = ko.observableArray([]);   
   
    $.getJSON('/api/getallusers', function (data) {
        grid = new Slick.Grid("#myGrid", data, columns, options);
    })
}

UserRegisterViewModel = { addUserViewModel: new User(), searchViewModel: new SearchUsers() };

$(document).ready(function () {    
    ko.applyBindings(UserRegisterViewModel);
  //  UserRegisterViewModel.UserListViewModel.getUsers();
    GridTest();
});