let btnEncryptionToggle = document.querySelector(".encryption_toggle");
let formEncription = document.querySelector(".encryption_form");
let encryptionInputText = document.querySelector(".encryption_input-text");
let encryptionInputFile = document.querySelector(".encryption_input-file");
let encryptionBtnKey = document.querySelector(".encryption_btn--key");
let encryptionBtnBack = document.querySelector(".encryption_btn--back");

let encryptionData = {
  text: "",
  picture: "",
  picture_length: "",
}
let toggleTypeEncryption = function() {
  toggleTypeEncryptionClass();
  cleanEncryptionForm();
  removeUploadedPic();

  if (getTypeEncryption() == "decipher") {
    encryptionInputText.disabled = true;
  } else {
    encryptionInputText.disabled = false;
  }
}

let toggleTypeEncryptionClass = function() {
  formEncription.classList.toggle("encryption_form--encrypt");
  formEncription.classList.toggle("encryption_form--decipher");
}

let cleanEncryptionForm = function() {
  encryptionInputText.value = "";
  encryptionInputFile.value = "";
}

let showUploadedPic = function(evt) {
  if (encryptionInputFile.value != "") {
    formEncription.classList.add("encryption_form--uploaded");
  }

  let reader = new FileReader();

  reader.onload = function(e) {

    console.log('adsasd');
    var img = document.createElement('img');

    img.onload = function() {
      console.log(this.width+'x'+this.height); // наконец-то результат
    };

    img.src = e.target.result;
  }
}
let removeUploadedPic = function() {
  formEncription.classList.remove("encryption_form--uploaded");
}
let getPic = function() {
  let reader = new FileReader();
  reader.readAsDataURL(encryptionInputFile.files[0])

  let createImg = function(evt) {
    let img = document.createElement('img');

    encryptionData.picture = evt.target.result;

    img.src = evt.target.result;

    let showSize = function() {
      encryptionData.picture_length = img.width * img.height;
    };

    img.addEventListener("load", showSize);
  }

  reader.addEventListener("load", createImg);
}

let tapEncryptionBtnKey = function(evt) {
  evt.preventDefault();

  if (getTypeEncryption() == 'encrypt') {
    if (getStepEncryption() == 1) {
      goNextStep();
    } else {
      fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(encryptionData),
        })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
  }
  if (getTypeEncryption() == 'decipher') {
    delete encryptionData.text;
    fetch(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encryptionData),
      })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }
}

let getTypeEncryption = function() {
  if (formEncription.classList.contains('encryption_form--encrypt')) {
    return 'encrypt';
  }
  return 'decipher';
}
let getStepEncryption = function() {
  if (formEncription.classList.contains('encryption_form--step-1')) {
    return 1;
  }
  return 2;
}

let goNextStep = function() {
  formEncription.classList.remove("encryption_form--step-1");
  formEncription.classList.add("encryption_form--step-2");
}
let goPreviousStep = function() {
  formEncription.classList.add("encryption_form--step-1");
  formEncription.classList.remove("encryption_form--step-2");
}



btnEncryptionToggle.addEventListener("click", toggleTypeEncryption);
encryptionInputFile.addEventListener("change", showUploadedPic);
encryptionInputFile.addEventListener("change", getPic);
encryptionBtnKey.addEventListener("click", tapEncryptionBtnKey);
encryptionBtnBack.addEventListener("click", goPreviousStep);


//раздел info

let info = document.querySelector('.info');
let infoHowEncrypt = info.querySelector('.info_how--encrypt');
let schemeEncrypt = infoHowEncrypt.querySelector('.info_how-scheme');
let schemeEncryptIcons = schemeEncrypt.querySelectorAll('.info_how-scheme-icon');
let schemeEncryptIconsArr = Array.from(schemeEncryptIcons);
let schemeEncryptTexts = infoHowEncrypt.querySelectorAll('.info_how-text');
let schemeEncryptTextsArr = Array.from(schemeEncryptTexts);

schemeEncrypt.addEventListener('click', function(event) {
  let icon = event.target.closest(".info_how-scheme-icon");

  if (icon) {
    for (let icon of schemeEncryptIconsArr) {
      icon.classList.remove("info_how-scheme-icon--active");
    }
    icon.classList.add("info_how-scheme-icon--active");

    let iconNum = icon.dataset.count;

    for (let text of schemeEncryptTextsArr) {
      text.classList.remove("info_how-text--active");
    }
    infoHowEncrypt.querySelector(`.info_how-text--${iconNum}`).classList.add("info_how-text--active");
  }
});

let infoHowDecipher = info.querySelector('.info_how--decipher');
let schemeDecipher = infoHowDecipher.querySelector('.info_how-scheme');
let schemeDecipherIcons = schemeDecipher.querySelectorAll('.info_how-scheme-icon');
let schemeDecipherIconsArr = Array.from(schemeDecipherIcons);
let schemeDecipherTexts = infoHowDecipher.querySelectorAll('.info_how-text');
let schemeDecipherTextsArr = Array.from(schemeDecipherTexts);

schemeDecipher.addEventListener('click', function(event) {
  let icon = event.target.closest(".info_how-scheme-icon");

  if (icon) {
    for (let icon of schemeDecipherIconsArr) {
      icon.classList.remove("info_how-scheme-icon--active");
    }
    icon.classList.add("info_how-scheme-icon--active");

    let iconNum = icon.dataset.count;

    for (let text of schemeDecipherTextsArr) {
      text.classList.remove("info_how-text--active");
    }
    infoHowDecipher.querySelector(`.info_how-text--${iconNum}`).classList.add("info_how-text--active");
  }
});

//# sourceMappingURL=app.js.map
