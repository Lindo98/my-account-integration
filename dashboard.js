function _getProject(_id) {
  let _store = window.localStorage.getItem("pprint-projects") || {};
  if (typeof _store === "string") _store = JSON.parse(_store);
  return _store[_id];
}
function _decode(_str) {
  let _val = JSON.parse(decodeURIComponent(_str));
  if (_val.projectId)
    _val.preview = `https://s3-eu-west-1.amazonaws.com/pitchprint.io/previews/${_val.projectId}_1.jpg`;
  return _val;
}

const apiURL = "https://api.pitchprint.io/client/fetch-recent";

fetch(apiURL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    saveForLater: "",
    token:
      "4ae0afe5028cb7fe6d28015768900358:e6a37f6eeafaefd9b8b2e94065f69372a7277c4e24341f8ebcbdf48a9c86932b671c02f414af1d45e5e5fd77abf35a44c5ff8a260fd8e695e00905e2c5185b8d9b446e2adf382f24714ad63270df5293e024475e746199092bb319f8b8e43e9ec005ca478ff8405fc61c496ad6b0ab7e5fdd8243d1dcb3ad958974fdd0e0e0bd986a27464e0f4cda4ada65275e02f5589b22e9472f03b06128146e3c02f8950c2b1214755937baf9f4ed3b20bdcefdfc590c2f6473766cc99b8947483a543aba3c9e1ecd41631f5d4bd99693b5443b374f4173231e4e6af02904fd4b96500da8",
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    // display data

    const contentPreview = document.getElementById("content");

    if (data.data.length > 0) {
      data.data.forEach((project) => {
        // Create a div element for each project
        const projectDiv = document.createElement("div");

        //style the div created for each project
        projectDiv.style.backgroundColor = "white";
        projectDiv.style.padding = "10px";
        projectDiv.style.borderRadius = "10px";
        projectDiv.style.boxShadow = "0 5px 10px rgba(0, 0, 0, 0.1)";
        projectDiv.style.margin = "15px";

        // show the image if the project has an image

        projectDiv.innerHTML += `<img src="${project.preview}" />`;

        projectDiv.innerHTML += `<p>User Id: ${project.userId}</p>`;
        projectDiv.innerHTML += `<p>Project Id: ${project.id}</p>`;
        projectDiv.innerHTML += `<button class="view-btn">View</button>`;
        projectDiv.innerHTML += `<button class="delete-btn">Delete</button>`;

        // Add an event listener to the button
        projectDiv.querySelector(".view-btn").addEventListener("click", () => {
          // customer will change the path back to the product page
          window.location.href = `index.html?id=${project.id} `;
        });

        projectDiv
          .querySelector(".delete-btn")
          .addEventListener("click", () => {
            // remove the project from the projects list
            const projects = window.localStorage.getItem("pprint-projects");
            if (projects) {
              const projectsObj = JSON.parse(projects);
              delete projectsObj[project.id];
              window.localStorage.setItem(
                "pprint-projects",
                JSON.stringify(projectsObj)
              );
            }
          });

        //add an event listener to the delete button also Delete the project from the database

        contentPreview.appendChild(projectDiv);
      });
    }
  });
