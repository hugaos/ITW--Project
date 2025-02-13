$(document).ready(function () {
  function MyViewModel() {
    var self = this;
    self.records = ko.observableArray([]);
    self.baseUri = ko.observable(); 
    self.Id = ko.observable();
    self.Name = ko.observable();
    self.IOC = ko.observable();
    self.Flag = ko.observable();
          
    $.ajax({
      type: "GET",
      url: "http://192.168.160.58/Olympics/api/countries?page=1&pagesize=300",
      dataType: "json",
      success: function (data) {
        self.records(data.Records);
      }
    });
    $("#search-form").submit(function(event){
      event.preventDefault();
      // Get the search query from the input field
      var q= $('#searchInput').val();
      // Make an AJAX request to the server to get the search results
      if(q!=""){
        $.ajax({
          type: 'GET',
          url: "http://192.168.160.58/Olympics/api/Countries/SearchByName?q=" + q,
          dataType:"json",
          success: function(data) {
            self.records(data);
          },      
        }) 
      }
    });
    self.reset=function(){
      $.ajax({
        type: "GET",
        url: "http://192.168.160.58/Olympics/api/countries?page=1&pagesize=300",
        dataType: "json",
        success: function (data) {
          self.records(data.Records);
          $('#searchInput').val("");
        }
      });
    }

  }
    
  ko.applyBindings(new MyViewModel());
});