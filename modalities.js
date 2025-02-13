jQuery(document).ready(function () {
    function ViewModel () {
      const self = this
      self.modalities= ko.observableArray([]);
      self.modId=ko.observableArray([]);
      
      $.ajax({
        type:"GET",
        url: "http://192.168.160.58/Olympics/api/Modalities?page=1&pagesize=66",
        dataType:"json",
        success:function(data){
          self.modalities(data.Records);
        }
      })
    }
    ko.applyBindings(new ViewModel())


  });
  