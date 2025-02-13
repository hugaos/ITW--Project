// ViewModel KnockOut
function vm() {
    console.log("ViewModel initiated...");
    //---Variáveis locais
    const self = this;
    self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/countries/");
    self.baseUri2 = ko.observable("http://192.168.160.58/Olympics/api/Statistics/Medals_Country");
    self.displayName = "Olympic Games edition Details";
    self.error = ko.observable("");
    self.passingMessage = ko.observable("");
    //--- Data Record
    self.Id = ko.observable("");
    self.Name = ko.observable("");
    self.Photo = ko.observable("");
    self.Modality = ko.observable("");
    self.Results = ko.observable("");
    self.Flag = ko.observable("");

    self.Events = ko.observable("");
    self.Array = ko.observableArray("");
    self.Medals = ko.observableArray([]);
    self.MedalID = ko.observable("");
    self.Counter = ko.observable("");
  
    //--- Page Events
    self.activate = function (id) {
      console.log("CALL: getGame...");
      const composedUri = self.baseUri() + id;
      ajaxHelper(composedUri, "GET").done(function (data) {
        console.log(data);
  
        self.Id(data.Id);
        self.Events(data.Events);
        self.Name(data.Name);
        self.Photo(data.Photo);
        self.Modality(data.Modality);
        self.Results(data.Results);
        self.Flag(data.Flag);

        self.Events(data.Events);
        self.Array(data.Array);
        self.Medals(data.Medals);
        self.MedalID(data.MedalId);
        self.Counter(data.Counter);
        
      });
      ajaxHelper(self.baseUri2, "GET").done(function (data) {
        console.log(data);
        hideLoading();
  
        const medals = data.filter((item) => item.CountryId == self.Id())[0]
          .Medals;
  
        self.Medals(medals);
      });
    };
  
    //--- Internal functions
    function ajaxHelper(uri, method, data) {
      self.error(""); // Clear error message
      return $.ajax({
        type: method,
        url: uri,
        dataType: "json",
        contentType: "application/json",
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("AJAX Call[" + uri + "] Fail...");
          hideLoading();
          self.error(errorThrown);
        },
      });
    }
  
    function showLoading() {
      $("#myModal").modal("show", {
        backdrop: "static",
        keyboard: false,
      });
    }
    function hideLoading() {
      $("#myModal").on("shown.bs.modal", function (e) {
        $("#myModal").modal("hide");
      });
    }
  
    function getUrlParameter(sParam) {
      const sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split("&");
  
      for (let urlVar of sURLVariables) {
        let sParameterName = urlVar.split("=");
  
        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined
            ? true
            : decodeURIComponent(sParameterName[1]);
        }
      }
    }
  
    //--- start ....
    showLoading();
    const pg = getUrlParameter("id");
    console.log(pg);
    if (pg == undefined) self.activate(1);
    else {
      self.activate(pg);
    }
    console.log("VM initialized!");
  }
  
  $(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
  });
  
  $(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal("hide");
  });
  