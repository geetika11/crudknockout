﻿var UserRegisterViewModel;
var grid;

function User(UserID, Name, Address, Age, Gender, PhoneNumber) {
    var self = this;
    self.UserID = ko.observable(UserID);    
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
                UserRegisterViewModel.UserListViewModel.users.push(new User(data.UserID, data.Name, data.Address, data.Age, data.Gender, data.PhoneNumber));
                self.UserID(null);
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

function UserList() {
    var self = this;
    // observable arrays are update binding elements upon array changes
    self.users = ko.observableArray([]);
    self.EditName = ko.observable();
    self.EditAddress = ko.observable();
    self.EditPhoneNumber = ko.observable();
    self.SeUserID = ko.observable();
    self.DetailName = ko.observable();
    self.DetailAddress = ko.observable();
    self.DetailAge = ko.observable();
    self.DetailGender = ko.observable();
    self.DetailPhoneNumber = ko.observable();
    self.getUsers = function () {
        self.users.removeAll();
        // retrieve user list from server side and push each object to model's students list
        $.getJSON('/api/getallusers', function (data) {
            $.each(data, function (key, value) {
                self.users.push(new User(value.UserID, value.Name, value.Address, value.Age, value.Gender, value.PhoneNumber));
            });
        });
    };
    //// remove user. current data context object is passed to function automatically.
    self.removeUser = function (User) {
        $.ajax({
            url: '/api/deleteuser/' + User.UserID(),
            type: 'delete',
            contentType: 'application/json',
            success: function () {
                self.users.remove(User);
            }
        });
    };
    self.EditUser = function (User) {
        $(".focus").modal('show')
        self.EditName(User.Name())
        self.EditAddress(User.Address())
        self.EditPhoneNumber(User.PhoneNumber())
        self.SeUserID(User.UserID())
    }
    self.UpdatedUser = function () {
        var dataObj = { Name: self.EditName(), Address: self.EditAddress(), PhoneNumber: self.EditPhoneNumber() };
        $.ajax({
            url: '/api/updateuser/' + self.SeUserID(),
            type: 'put',
            data: JSON.stringify(dataObj),
            contentType: 'application/json',
            dataType: 'json',
        });
    }
    self.Detail = function (User) {
        $(".fade").modal('show')
        self.DetailName(User.Name())
        self.DetailAddress(User.Address())
        self.DetailAge(User.Age())
        self.DetailGender(User.Gender())
        self.DetailPhoneNumber(User.PhoneNumber())
    }
}

function SearchUsers(SearchString) {
    var self = this;
    self.users = ko.observableArray([]);
    self.SearchString = ko.observable(SearchString);
    self.SearchUser = function () {
        self.users.removeAll();
        var data = { SerchString: self.SearchString() }

        $.ajax({
            url: '/api/searchuser/' + self.SearchString(),
            type: 'put',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (DATA) {
                $.each(DATA, function (key, value) {
                    self.users.push(new User(value.UserID, value.Name, value.Address, value.Age, value.Gender, value.PhoneNumber));
                });
            }//end of success
        })//end of ajax
    }
}
function GridTest() {
    var self = this;
    
    var columns = [
        { id: "UserID", name: "ID", field: "ID" },
        { id: "Name", name: "Name", field: "Name" },
        { id: "Address", name: "Address", field: "Address" },
        { id: "Age", name: "Age", field: "Age" },
        { id: "Gender", name: "Gender", field: "Gender" },
        { id: "PhoneNumber", name: "PhoneNumber", field: "PhoneNumber" }
    ];
    var options = {
        enableCellNavigation: true,
        enableColumnReorder: false
    };
    self.users = ko.observableArray([]);   

    $.getJSON('/api/getallusers', function (data) {
        grid = new Slick.Grid("#myGrid", data, columns, options);
    })
}

UserRegisterViewModel = { addUserViewModel: new User(), UserListViewModel: new UserList(), searchViewModel: new SearchUsers() };

$(document).ready(function () {    
    ko.applyBindings(UserRegisterViewModel);
    UserRegisterViewModel.UserListViewModel.getUsers();
    GridTest();
});