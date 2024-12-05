var _launchButton = document.getElementById("launch_btn");
_previewDiv = document.getElementById("pp_preview_div");
_loaderDiv = document.getElementById("pp_loader_div");

// this is to disable the launch button until PitchPrint is ready for use
_launchButton.setAttribute("disabled", "disabled");

// initializing PitchPrint

var ppClient = new PitchPrintClient({
  apiKey: "f80b84b4eb5cc81a140cb90f52e824f6", //Kindly provide your own APIKey
  designId: "3d8f3899904ef2392795c681091600d0", //Change this to your designId
  userId: "37063281-a764-4b5b-8163-cec7ab1884a9", //Change to your userId
  custom: true,
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
    apiKey: "",
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

// add an event listener for when the my account button is clicked to show modal

const openModalBtn = document.getElementById("my-account");
const modal = document.querySelector(".modal");

const openModal = function () {
  modal.classList.remove("hidden");
};

openModalBtn.addEventListener("click", openModal);
ppClient.on("app-validated", appValidated);

// Fetch data from projects

const apiURL = "https://api.pitchprint.io/client/fetch-recent";

fetch(apiURL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    saveForLater: "",
    // add your own token, go to devTools > Application then localStorage > pptoken
    token:
      "d41b6c2602ed7c2d401a37422511cb82:c9767277725223a2ccb6f04699ca93d4b61d4ec7295075e69b1a30aa091ba6abd2ffca0c2e60aa0dbc08127850792257f46842fbc9a14ce738e1658f01ab913e292fc5060751d6ca35781df9efa9856b4aa80bb70580a44e2c3f9f5fb5cd2ae1583766a0d077b6b04d7c1785b5c8136e778748f4c35511a2b7936eca613278412ab774c2425ae931e73114f998070cb3810533db94a3f68818178dc4bf4cefa9f8c72ad54f3025f73a6314538d6ea2c30b1f1f904b57cf2d7f54329dd5a0316f9028547dccddfa26dfd56c3da7a08c7171ac3988406384d64d0c7728b2d7074b",
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

    const contentPreview = document.getElementById("content");

    if (data.data.length > 0) {
      // sort projects by date, newly added display on top
      const projects = data.data.reverse();

      projects.forEach((project) => {
        const projectDiv = document.createElement("div");

        // Style your layout as you like
        projectDiv.style.backgroundColor = "white";
        projectDiv.style.padding = "10px";
        projectDiv.style.borderRadius = "10px";
        projectDiv.style.boxShadow = "0 5px 10px rgba(0, 0, 0, 0.1)";
        projectDiv.style.margin = "15px";

        projectDiv.innerHTML += `<img class="project-img" src="https://s3-eu-west-1.amazonaws.com/pitchprint.io/previews/${project.id}_1.jpg" />`;

        projectDiv.innerHTML += `<h3>Project Title: ${project.title}</h3>`;
        projectDiv.innerHTML += `<p><b>User Id:</b> ${project.userId}</p>`;
        projectDiv.innerHTML += `<button class="view-btn">View</button>`;
        projectDiv.innerHTML += `<button class="delete-btn">Delete</button>`;

        // to edit the project, add a path to your product page
        projectDiv.querySelector(".view-btn").addEventListener("click", () => {
          window.location.href = `index.html?id=${project.id}`;
        });

        let _projects = window.localStorage.getItem("pprint-projects") || {};

        if (typeof _projects === "string") _projects = JSON.parse(_projects);
        _projects[project.id] = project;
        window.localStorage.setItem(
          "pprint-projects",
          JSON.stringify(_projects)
        );

        // to delete the project
        projectDiv
          .querySelector(".delete-btn")
          .addEventListener("click", async () => {
            const confirmDelete = confirm(
              "Are you sure you want to delete this project?"
            );
            if (!confirmDelete) return;

            try {
              // Send DELETE request to the API
              const response = await fetch(`apiURL/${project.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (!response.ok) {
                throw new Error("Failed to delete project from API");
              }

              // Delete from local storage
              let _projects =
                window.localStorage.getItem("pprint-projects") || {};

              if (typeof _projects === "string")
                _projects = JSON.parse(_projects);
              delete _projects[project.id];
              window.localStorage.setItem(
                "pprint-projects",
                JSON.stringify(_projects)
              );

              // Remove the project div from the DOM
              projectDiv.remove();
            } catch (error) {
              console.error("Error deleting project:", error);
              alert("Error deleting project. Please try again.");
            }
          });

        contentPreview.appendChild(projectDiv);
      });
    }
  });
