// ViewModel KnockOut
function vm() {
    console.log("ViewModel initiated...");
    //---Variáveis locais
    const self = this;
    self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/modalities/");
    self.displayName = "Olympic Games edition Details";
    self.error = ko.observable("");
    self.passingMessage = ko.observable("");
    //--- Data Record
    self.Id = ko.observable("");
    self.Name = ko.observable("");
    self.Modalities = ko.observable("");
    self.Photo = ko.observable("");

    //--- Page Events
    self.activate = function (id) {
      console.log("CALL: getGame...");
      const composedUri = self.baseUri() + id;
      ajaxHelper(composedUri, "GET").done(function (data) {
        console.log(data);
  
        self.Id(data.Id);
        self.Name(data.Name);
        self.Modalities(data.Modalities);
        self.Photo(data.Photo);
  
      });
      ajaxHelper(self.baseUri, "GET").done(function (data) {
        console.log(data);
        hideLoading();
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
  