// Your API key and project ID

const apiKey = "key_26edfc2cb57d64ce529a3a9e098c63bd"; // Replace with your actual API key
const projectId = "7b52b6ccdb9918dc576b06b693f3662166"; // Replace with your actual project ID

// replace with the actual endpoint for the API you're using
const apiUrl = `https://admin.pitchprint.com/projects${projectId}?api_key=${apiKey}`;

// Get the Projects link and content div
const projectsLink = document.getElementById("view-projects");
const contentDiv = document.querySelector(".content");

// Function to fetch and display projects
async function fetchAndDisplayProjects() {
  try {
    // Fetch projects from the API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Clear existing content
    contentDiv.innerHTML = "";

    // Display the projects in the content div
    data.projects.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.className = "project";
      projectElement.innerHTML = `
                  <h2>${project.name}</h2>
                  <p>${project.description}</p>
                  <img src="${project.image}" alt="${project.name}">
              `;
      contentDiv.appendChild(projectElement);
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    contentDiv.innerHTML = `<p>Error loading projects. Please try again later.</p>`;
  }
}

// Add click event listener to the "Projects" link
projectsLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the default link behavior
  fetchAndDisplayProjects(); // Fetch and display projects when clicked
});
