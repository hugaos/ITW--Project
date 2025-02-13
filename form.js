$().ready(function() {
    $("#dateInput").datepicker();
    $("#dateInput2").datepicker();

    $("#playerSuggestionForm").submit(function(event){
      event.preventDefault();
      // Get the search query from the input field
      // Make an AJAX request to the server to get the search results
    if (retVal1==true && retVal2==true && retVal3==true && retVal4==true){
        alert("Thank you for your suggestion. Our team will carefully review it.");
        window.location.href = 'index.html';
    }   

    })
        
});


function validate() {
    var retVal = true; /* Vamos partir do princípio de que o formulário está válido ... */
    retVal1 = validateNome()
    retVal2 = validateCountry()
    retVal3 = validateBirth();
    retVal4 = validateModality();

    return retVal1 && retVal2 && retVal3 && retVal4;
}
function validateNome() {
    nome = document.getElementById("Nome").value;
    if (nome.length < 3) {
        document.getElementById("NomeError").classList.remove("d-none");
        return false;
    } else {
        if (!document.getElementById("NomeError").classList.contains("d-none")) {
            document.getElementById("NomeError").classList.add("d-none");
        }
        return true
    }
}
function validateCountry() {
    country = document.getElementById("country").value;
    if (country.length < 3) {
        document.getElementById("countryError").classList.remove("d-none");
        return false;
    } else {
        if (!document.getElementById("countryError").classList.contains("d-none")) {
            document.getElementById("countryError").classList.add("d-none");
        }
        return true
    }
}
function validateBirth(){
    birth = document.getElementById("dateInput").value;
    if (birth==""){
        document.getElementById("dateError").classList.remove("d-none");
        return false;
    }else {
        if (!document.getElementById("dateError").classList.contains("d-none")) {
            document.getElementById("dateError").classList.add("d-none");
        }
        return true
    }
}
function validateModality() {
    modality = document.getElementById("modality").value;
    if (modality.length < 3) {
        document.getElementById("modalityError").classList.remove("d-none");
        return false;
    } else {
        if (!document.getElementById("modalityError").classList.contains("d-none")) {
            document.getElementById("modalityError").classList.add("d-none");
        }
        return true
    }
}