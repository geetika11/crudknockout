﻿
var UserRegisterViewModel;
var grid;
// use as register student views view model
function User(UserID, Name, Address, Age, Gender,PhoneNumber) {
    var self = this;
//    // observable are update elements upon changes, also update on element data changes [two way binding]
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
    };
}

// use as user list view's view model
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
    //var columns = [
    //    { id: "ID", name: "ID", field: "ID" },
    //    { id: "Name", name: "Name", field: "Name" },
    //    { id: "Address", name: "Address", field: "Address" },
    //    { id: "Age", name: "Age", field: "Age" },
    //    { id: "Gender", name: "Gender", field: "Gender" },
    //    { id: "PhoneNumber", name: "PhoneNumber", field: "PhoneNumber" }

    //];
    //var options = {
    //    enableCellNavigation: true,
    //    enableColumnReorder: false
    //};


    //self.slickdata = ko.observableArray([]);
    ////self.users = ko.observableArray([]);
    ////$.ajax({
    ////    url: '/api/getallusers',
    ////    type: 'get',        
    ////    //contentType: 'application/json',
    ////    success: function (DATA) {
    ////        $.each(DATA, function (key, value) {
    ////            self.users.push(new User(value.UserID, value.Name, value.Address, value.Age, value.Gender, value.PhoneNumber));
    ////        });
    ////    }//end of success
    ////})//end of ajax        
    //$.getJSON('/api/getallusers', function (data) {
    //    for (var i = 0; i < data.length; i++) {
    //        slickdata[i] = {



    //                ID: data[i].UserID,
    //                Name: data[i].Name,
    //                Address: data[i].Address,
    //                Age: data[i].Age,
    //                Gender: data[i].Gender,
    //                PhoneNumber: data[i].PhoneNumber
    //            };
    //        }
    //        //$.each(data, function (key, value) {

    //        //   // console.log('value of value' + JSON.stringify(uvalue))
    //        //    //var value = JSON.stringify(uvalue)               
    //        //    self.slickdata.push(new User(value.UserID, value.Name, value.Address, value.Age, value.Gender, value.PhoneNumber));

    //        //});
    //});
    //console.log('value of slickdata' + slickdata)    
    var columns = [
        { id: "title", name: "Title", field: "title" },
        { id: "duration", name: "Duration", field: "duration" },
        { id: "%", name: "% Complete", field: "percentComplete" },
        { id: "start", name: "Start", field: "start" },
        { id: "finish", name: "Finish", field: "finish" },
        { id: "effort-driven", name: "Effort Driven", field: "effortDriven" }
    ];
    var options = {
        enableCellNavigation: true,
        enableColumnReorder: false
    };
    $(function () {
        var data = [];
        for (var i = 0; i < 500; i++) {
            data[i] = {
                title: "Task " + i,
                duration: "5 days",
                percentComplete: Math.round(Math.random() * 100),
                start: "01/01/2009",
                finish: "01/05/2009",
                effortDriven: (i % 5 == 0)
            };
        }

        grid = new Slick.Grid("#myGrid", data, columns, options);
    })
}


// create index view view model which contain two models for partial views
UserRegisterViewModel = { addUserViewModel: new User(), UserListViewModel: new UserList(), searchViewModel: new SearchUsers()};

// on document ready
$(document).ready(function () {

    // bind view model to referring view
    ko.applyBindings(UserRegisterViewModel);

    // load student data
    UserRegisterViewModel.UserListViewModel.getUsers();
    GridTest();
   

});