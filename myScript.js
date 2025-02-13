$('document').ready(function () {
    const carousel = new bootstrap.Carousel('#myCarousel', {
    interval: 6000
    })
    function MyViewModel(){
        var self=this;
        var map = L.map('map', {minZoom:2, maxBounds: L.latLngBounds([-90, -180], [90, 180])}).setView([0, 0], 3);
        self.ids=ko.observableArray([]);

        $.ajax({
            type:"GET",
            url:"http://192.168.160.58/Olympics/api/Games?page=1",
            dataType:"json",
            success:function(data){
                $.each(data.Records, function(index, game) {

                    L.marker([game.Lat, game.Lon])
                    .bindPopup('<a href="games.html">'+ game.Name + " - " + game.CityName + ", " + game.CountryName) 
                    .addTo(map);
                });
            }
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(map);
    }
    ko.applyBindings(new MyViewModel());
    let theEnd=0;
        navbar=document.getElementById("navbar")
    window.addEventListener("scroll", function(){
        var scrollTop= window.pageXOffset || this.document.documentElement.scrollTop;
        if (scrollTop > theEnd){
            navbar.style.top="-56px";
        }
        else{
            navbar.style.top="0";
        }
        theEnd=scrollTop;
    })
});

