$(document).ready(function(){
  function MyViewModel() {
    var self = this;
    self.search=ko.observable(false)
    self.Page=ko.observable(1);
    self.athletes = ko.observableArray([]);
    self.selectedAthlete = ko.observable();
    self.athleteGames= ko.observableArray([]);
    self.athleteComp= ko.observableArray([]);
    self.currentPage = ko.observable("1");
    self.totalPages=ko.observable(3390);
    self.allNames=ko.observableArray([]);
    self.athlete=ko.observableArray([]);
    self.totalEntries=ko.observable(135571);
    // Load the athletes data from the API
    
    self.pageEntries = ko.computed(function() {
      if (!self.search()){
        var start = (self.Page() - 1) * 40 + 1;
        var end = Math.min(self.Page() * 40 , 135571);
        console.log("sdfgdsf")
        return start + "-" + end;
      }
      else {
        let end= self.totalEntries();
        return "1 - " + end;
      }
    });

    $.ajax({
      type:"GET",
      url:"http://192.168.160.58/Olympics/api/Athletes?page=1&pagesize=135571",
      dataType:"json",
      success:function(data){
        self.athlete(data.Records);
        for (let i = 0; i < self.athlete().length; i++) {
          self.allNames.push(self.athlete()[i].Name);

        }
      }
    });

    $( function() {  
      $( "#searchInput" ).autocomplete({
        source: function(request,response){
          var results = $.ui.autocomplete.filter(self.allNames(), request.term);
          response(results.slice(0, 10));
        },
        minLength: 4,
        open: function(event, ui) {
        $(".ui-autocomplete").css("border", "1px solid black");
        $(".ui-menu-item").hover(function() {
          $(this).css("background-color", "lightgray");
          }).mouseout(function() {
            $(this).css('background-color',"white" );
          });
        }
      });
    });
    self.reset=function(){
      $.ajax({
        type: "GET",
        url: "http://192.168.160.58/Olympics/api/Athletes?page=" + 1 + "&pagesize=40",
        dataType: "json",
        success: function(data) {
          $('#searchInput').val('');
          self.athletes(data.Records);
          self.search(false);
          self.totalEntries(135571);
          self.totalPages(3390);
          self.pageEntries();
          self.Page(1);
        }
      });
    }
    $("#search-form").submit(function(event){
      event.preventDefault();
      // Get the search query from the input field
      var q= $('#searchInput').val();
      // Make an AJAX request to the server to get the search results
      if(q!=""){
        $.ajax({
          type: 'GET',
          url: "http://192.168.160.58/Olympics/api/Athletes/SearchByName?q=" + q,
          dataType:"json",
          success: function(data) {
            self.search(true);
            self.athletes(data);
            self.totalEntries(self.athletes().length);
            self.totalPages(1);
            self.pageEntries();
            self.Page(1);
            $("#page").text("1");
          },       
        });
      }
      else if (q==""){
        $.ajax({
          type: "GET",
          url: "http://192.168.160.58/Olympics/api/Athletes?page=" + 1 + "&pagesize=40",
          dataType: "json",
          success: function(data) {
            self.athletes(data.Records);
            self.search(false);
            self.totalEntries(135571);
            self.totalPages(3390);
            self.pageEntries();
          }
        });
      }
    });

    self.showAthleteModal = function(athlete) {
      var id=athlete.Id;
      $.ajax({
        type:"GET",
        url: "http://192.168.160.58/Olympics/api/Athletes/FullDetails?id=" + id,
        dataType:"json",
        success: function(data) {
          // Assign the retrieved data to the selectedAthlete observable
          self.selectedAthlete(data);
          $('#athleteModal').modal('show');
        }
      });
    };  
    $.ajax({
      type: "GET",
      url: "http://192.168.160.58/Olympics/api/Athletes?page=" + self.Page() + "&pagesize=40",
      dataType: "json",
      success: function(data) {
        self.athletes(data.Records);

      }
    });
    self.totalpages=function(){
      if (!self.search()){
        return self.totalPages();
      }
      else{
        return 1;
      }
    }

    self.changePage = function() {
      if (self.totalPages()==3390){
        $.ajax({
          type: "GET",
          url: "http://192.168.160.58/Olympics/api/Athletes?page=" + self.Page() + "&pagesize=40",
          dataType: "json",
          success: function(data) {
            $("#page").text(data.CurrentPage);
            self.athletes(data.Records);
            self.totalPages(data.TotalPages);
          }
        });
      } else {
        $("#page").text(self.Page())
      }
    };
    self.currentPage=function(){
      return (self.Page())
    }
    self.lastpage= function(){
      self.Page(self.totalpages());
      self.changePage();
    }
    self.firstpage=function(){
      self.Page(1);
      self.changePage();
    }
    self.nextPage = function() {
      if (self.Page()< self.totalpages()){
        self.Page(self.Page() + 1);
        self.changePage();
      }
    };
    self.previousPage = function() {
      if (self.Page()>1){
        self.Page(self.Page() - 1);
        self.changePage();
      }

    };
  }
  
  ko.applyBindings(new MyViewModel());
});