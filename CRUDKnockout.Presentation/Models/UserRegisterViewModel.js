
var UserRegisterViewModel;

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

// use as student list view's view model
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

        // retrieve students list from server side and push each object to model's students list
        $.getJSON('/api/getallusers', function (data) {
            $.each(data, function (key, value) {
                self.users.push(new User(value.UserID, value.Name, value.Address, value.Age, value.Gender, value.PhoneNumber));
            });
        });
    };


    //// remove student. current data context object is passed to function automatically.
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
        $(".bs-example-modal-sm").modal('show')
        self.EditName(User.Name())
        self.EditAddress(User.Address())
        self.EditPhoneNumber(User.PhoneNumber())
        self.SeUserID(User.UserID())
    }


    self.UpdatedUser = function () {
        alert(self.EditName() + " Id: " + self.SeUserID() + " is ready to get updated");

        //    $.ajax({
        //        url: '/api/updateuser/' + User.UserID(),
        //        type: 'put',
        //        contentType: 'application/json',
        //        success: 'Ok'
        //    //});
        //)};
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

// create index view view model which contain two models for partial views
UserRegisterViewModel = { addUserViewModel: new User(),UserListViewModel: new UserList() };


// on document ready
$(document).ready(function () {

    // bind view model to referring view
    ko.applyBindings(UserRegisterViewModel);

    // load student data
    UserRegisterViewModel.UserListViewModel.getUsers();
});