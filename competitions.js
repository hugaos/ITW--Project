$().ready(function(){
    function MyViewModel() {
        var self=this;
        self.competition=ko.observableArray([]);
        self.competitions=ko.observableArray([]);
        self.Page=ko.observable(1);
        self.pagesize=ko.observable(40);
        self.selectedCompetition=ko.observable();
        self.part=ko.observableArray([]);
        self.totalPages=ko.observable(20);
        self.allNames=ko.observableArray([]);
        self.search=ko.observable(false);
        self.allcomp=ko.observableArray([]);
        self.graphCompetitions=ko.observableArray([]);
        $.ajax({
          type: "GET",
          url: "http://192.168.160.58/Olympics/api/Statistics/Games_Competitions",
          dataType: "json",
          success: function(data) {
            self.allcomp(data);
            for (var i = 0; i < self.allcomp().length; i++) {
              if (i % 5 == 0) {
                self.graphCompetitions.push(self.allcomp()[i]);
              }
            }
            drawStuff();
          }
        });
        self.chartContainerStyle = ko.computed(function() {
          return {
            display: self.search() ? 'none' : 'block'
          };
        });
        google.load("visualization", "1.1", { packages: ["bar"] });
        google.setOnLoadCallback(drawStuff);
        function drawStuff() {
          var data = new google.visualization.arrayToDataTable([
            ['Competition', 'Counter'],
            ...self.graphCompetitions().map(function(competition) {
              return competition && [competition.Name, competition.Counter];
            })
          ]);
          var options = {
            width: 1200,
            height:500,
            legend: { position: 'none' },
            chart: {
              title: 'Competitions per Olympic Games Edition',
              subtitle:"Number of competitions per Olympic Games Edition, along the years."
            },
            // Set the bar chart to be vertical
            bars: 'vertical',
            axes: {
              x: {
                0: { side: 'top', label: 'Olympic Games Edition' } // Top x-axis.
              },
              y:{
                0:{side: "left", label:"Competitions"}
              }
            },
            bar: { groupWidth: "90%" }
          };

          var chart = new google.charts.Bar(document.getElementById('chart'));
          chart.draw(data, options);
        };

        
        $.ajax({
            type:"GET",
            url:"http://192.168.160.58/Olympics/api/Competitions?page=1&pagesize=765",
            dataType:"json",
            success:function(data){
                self.competition(data.Records);
                for (let i = 0; i < self.competition().length; i++) {
                    self.allNames.push(self.competition()[i].Name);
      
                }
            }
          });

        $( function() {  
            $( "#searchInput" ).autocomplete({
              source: function(request,response){
                var results = $.ui.autocomplete.filter(self.allNames(), request.term);
                response(results.slice(0, 10));
              },
              minLength: 2,
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
          $("#search-form").submit(function(event){
            event.preventDefault();
            $( "#modalityInput" ).autocomplete( "close" );
            // Get the search query from the input field
            var q= $('#searchInput').val();
            $('.ui-helper-hidden-accessible').hide();

            // Make an AJAX request to the server to get the search results
            if(q!=""){
              $.ajax({
                type: 'GET',
                url: "http://192.168.160.58/Olympics/api/Competitions/SearchByName?q=" + q,
                dataType:"json",
                success: function(data) {
                  self.search(true);
                  drawStuff();
                  self.competitions(data);
                  self.totalPages(1);
                  $("#page").text("1")
                  self.Page(1);
                  console.log(self.search())
                },       
              });
            }
          });
          self.reset=function(){
            $.ajax({
              type: "GET",
              url: "http://192.168.160.58/Olympics/api/Athletes?page=" + 1 + "&pagesize=40",
              dataType: "json",
              success: function(data) {
                $('#searchInput').val('');
                self.search(false);
                self.totalPages(20);
                self.Page(1);
                self.changePage();
                drawStuff();
              }
            });
          }

        $.ajax({
            type:"GET",
            url:"http://192.168.160.58/Olympics/api/Competitions?page=" + self.Page() + "&pagesize=" + self.pagesize(),
            dataType:"json",
            success:function(data){
                self.competitions(data.Records);
            }
        })
        self.totalpages=function(){
            if (!self.search()){
              return self.totalPages();
            }
            else{
              return 1;
            }
        }
      
        self.changePage = function() {
            if (self.totalPages()==20){
                $.ajax({
                    type: "GET",
                    url: "http://192.168.160.58/Olympics/api/Competitions?page=" + self.Page() + "&pagesize=40",
                    dataType: "json",
                    success: function(data) {
                        $("#page").text(data.CurrentPage)
                        self.competitions(data.Records);
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
            console.log(self.Page())
            if (self.Page()>1){
              self.Page(self.Page() - 1);
              self.changePage();
              console.log("sad");
            }
      
        };
        

        self.showCompetition=function(competition){
            var id=competition.Id;
            $.ajax({
                type:"GET",
                url:"http://192.168.160.58/Olympics/api/Competitions/" + id,
                dataType:"json",
                success:function(data){
                    self.selectedCompetition(data);
                    self.part(data.Participant);
                    $('#competitionModal').modal('show');
                }
            })

        }

    }
    ko.applyBindings(new MyViewModel());
})