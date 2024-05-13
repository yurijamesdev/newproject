document.addEventListener('DOMContentLoaded', function() {
    const addSubProjectBtn = document.getElementById('add-sub-project-btn');
    const subProjectSections = document.getElementById('sub-project-sections');
    const form = document.getElementById('project-form');

    let subProjectCounter = 1; // Counter for naming sub-project elements uniquely

    addSubProjectBtn.addEventListener('click', function() {
        const subProjectSection = document.createElement('div');
        subProjectSection.classList.add('sub-project-section');
        subProjectSection.innerHTML = `
            <label for="sub-project-name-${subProjectCounter}">Sub Project Name:</label>
            <input type="text" name="subProjectName-${subProjectCounter}" class="sub-project-name">
            <label for="sub-task-${subProjectCounter}">Sub Task:</label>
            <input type="text" name="subTask-${subProjectCounter}" class="sub-task" placeholder="Sub Task">
            <label for="sub-due-date-${subProjectCounter}">Sub Task Due Date:</label>
            <input type="date" name="subDueDate-${subProjectCounter}" class="sub-due-date" placeholder="Sub Task Due Date">
            <label>Assign Sub Task To:</label>
            <label for="sub-assign-brian-${subProjectCounter}"><input type="radio" id="sub-assign-brian-${subProjectCounter}" name="subAssignTo-${subProjectCounter}" value="Brian"> Brian</label>
            <label for="sub-assign-konyi-${subProjectCounter}"><input type="radio" id="sub-assign-konyi-${subProjectCounter}" name="subAssignTo-${subProjectCounter}" value="Konyi"> Konyi</label>
            <label for="sub-assign-max-${subProjectCounter}"><input type="radio" id="sub-assign-max-${subProjectCounter}" name="subAssignTo-${subProjectCounter}" value="Max"> Max</label>
            <!-- Add more radio buttons as needed -->
        `;
        subProjectSections.appendChild(subProjectSection);
        subProjectCounter++;
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(form);
        const subProjects = [];

        // Extract sub-project data from the form
        document.querySelectorAll('.sub-project-section').forEach((subProjectSection) => {
            const subProjectName = subProjectSection.querySelector('.sub-project-name').value;
            const subTask = subProjectSection.querySelector('.sub-task').value;
            const subDueDate = subProjectSection.querySelector('.sub-due-date').value;
            const subAssignTo = subProjectSection.querySelector('input[name^="subAssignTo"]:checked');

            if (subProjectName && subTask && subDueDate && subAssignTo) {
                const subProjectData = {
                    subProjectName,
                    subTask,
                    subDueDate,
                    subAssignTo: subAssignTo.value
                };
                subProjects.push(subProjectData);
            }
        });

        // Add subProjects array to formData
        formData.append('subProjects', JSON.stringify(subProjects));

        // Send form data to server endpoint for saving
        fetch('/saveProject', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/'; // Redirect if successful
            } else {
                throw new Error('Failed to create project'); // Throw an error to be caught below
            }
        })
        .catch(error => {
            console.error('Error creating project:', error);
            // Handle error here, e.g., show an error message to the user
        });
    });

});
