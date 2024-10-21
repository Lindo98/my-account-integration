var _launchButton = document.getElementById("launch_btn");
_previewDiv = document.getElementById("pp_preview_div");
_loaderDiv = document.getElementById("pp_loader_div");

// this is to disable the launch button until PitchPrint is ready for use
_launchButton.setAttribute("disabled", "disabled");

// initializing PitchPrint

var ppClient = new PitchPrintClient({
  apiKey: "key_26edfc2cb57d64ce529a3a9e098c63bd",
  designId: "d42302b363615e5572feae8060eed01c",
  userId: "37063281-a764-4b5b-8163-cec7ab1884a9",
  custom: true,
  userAccountPath: "/dashboard.html",
});

function doClient() {
  _productId = "";
  let _store = window.localStorage.getItem("pprint-custom") || {};
  if (typeof _store === "string") _store = JSON.parse(_store);
  let _cValues = _store[_productId] || {};
  if (typeof _cValues === "string") _cValues = _decode(_cValues);
  if (!document.getElementById("_pitchprint"))
    _cartForm.insertAdjacentHTML(
      "afterbegin",
      `<input id="_pitchprint" name="properties[_pitchprint]" type="hidden" value="${
        _cValues.projectId || ""
      }">`
    );

  window.ppclient = new PitchPrintClient({
    userId: window.__st.cid,
    designId: _values.designId,
    mode:
      _cValues.type === "u" ? "upload" : _cValues.projectId ? "edit" : "new",
    projectId: _cValues.projectId || "",
    apiKey: window.Shopify.shop,
    product: {
      id: _productId,
      name: window.__st.pageurl.split("/").pop().split("-").join(" "),
    },
  });

  window.ppclient.on("session-saved", _saveSession);
}

// This function will run/launch the app once it's ready for use
var appValidated = () => {
  _launchButton.removeAttribute("disabled");
  _launchButton.onclick = () => ppClient.showApp();
  _loaderDiv.style.display = "none";
};

// This function will run when the app has been used and user has saved some projects

// var projectSaved = (_val) => {
//   var _el = document.getElementById("_pitchprint"),
//     _projectId = _val.data.projectId;

//   let _store = window.localStorage.getItem("pprint-sp") || {},
//     _projects = window.localStorage.getItem("pprint-projects") || {};

//   if (typeof _store === "string") _store = JSON.parse(_store);
//   if (typeof _projects === "string") _projects = JSON.parse(_projects);

//   if (_val.data.clear) {
//     _el.value = "";
//     delete _store[_productId];
//     delete _projects[_projectId];
//   } else {
//     _el.value = _projectId;
//     _store[_productId] = _val.data.values;
//     _projects[_projectId] = _val.data.values;
//     if (_projectId.substr(0, 2) === "U-") {
//       delete _projects[_projectId].previews;
//       _zipFiles(_val.data.values);
//       console.log(_projects[_projectId]);
//     }
//   }
//   window.localStorage.setItem("pprint-sp", JSON.stringify(_store));
//   window.localStorage.setItem("pprint-projects", JSON.stringify(_projects));
//   if (_val.data.clear) window.location.reload();
// };
// function _zipFiles(_val) {
//   _val = _decode(_val);
//   window.ppclient
//     ._comm("zip-uploads", { files: _val.files, id: _val.projectId })
//     .catch(console.log);
// }

ppClient.on("app-validated", appValidated);
// ppClient.on("project-saved", projectSaved);
