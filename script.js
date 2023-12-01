let usersData = []; // Store the fetched data globally
  
fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
  .then(response => response.json())
  .then(data => {
    usersData = data;
    renderTable(usersData);
  });

function renderTable(users) {
  const currentPage = 1;
  const usersPerPage = 10;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  for (let i = startIndex; i < endIndex && i < users.length; i++) {
    const user = users[i];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" class="userCheckbox" data-id="${user.id}"></td>
      <td>${user.id}</td>
      <td contenteditable="false">${user.name}</td>
      <td contenteditable="false">${user.email}</td>
      <td>
        <button class="edit" onclick="editRow(${user.id})">Edit</button>
        <button class="delete" onclick="deleteRow(${user.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }

  updatePagination(currentPage, Math.ceil(users.length / usersPerPage));
}

function search() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm)
  );

  renderTable(filteredUsers);
}

function navigate(direction) {
  const totalPages = Math.ceil(usersData.length / 10);
  let currentPage = parseInt(document.getElementById('currentPage').textContent.split(' ')[1]);

  switch (direction) {
    case 'first':
      currentPage = 1;
      break;
    case 'previous':
      currentPage = Math.max(1, currentPage - 1);
      break;
    case 'next':
      currentPage = Math.min(totalPages, currentPage + 1);
      break;
    case 'last':
      currentPage = totalPages;
      break;
  }

  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, usersData.length);
  const displayedUsers = usersData.slice(startIndex, endIndex);

  renderTable(displayedUsers);
  updatePagination(currentPage, totalPages);
}

function selectAll() {
  const checkboxes = document.getElementsByClassName('userCheckbox');
  const selectAllCheckbox = document.getElementById('selectAll');
  const isSelectAllChecked = selectAllCheckbox.checked;

  for (let checkbox of checkboxes) {
    checkbox.checked = isSelectAllChecked;
  }
}

function editRow(userId) {
  const row = document.querySelector(`tr[data-id="${userId}"]`);

  if (row) {
    const nameCell = row.querySelector('.name-cell');
    const emailCell = row.querySelector('.email-cell');

    // Create input fields for editing
    const nameInput = document.createElement('input');
    const emailInput = document.createElement('input');

    nameInput.value = nameCell.textContent.trim();
    emailInput.value = emailCell.textContent.trim();

    // Clear the content and append input fields
    nameCell.innerHTML = '';
    emailCell.innerHTML = '';

    nameCell.appendChild(nameInput);
    emailCell.appendChild(emailInput);

    // Add a save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
      saveRow(userId);
    });

    // Append the save button
    nameCell.appendChild(saveButton);

    // Add a cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      cancelEdit(userId);
    });

    // Append the cancel button
    emailCell.appendChild(cancelButton);
  }
}



function cancelEdit(userId) {
  // Revert changes if needed
  editRow(userId);
}





function deleteRow(userId) {
  // Log the userId for debugging
  console.log('Deleting Row with userId:', userId);

  // Delete the row from the in-memory data
  usersData = usersData.filter(user => user.id !== userId);

  // Log the updated in-memory data for debugging
  console.log('Updated Users Data:', usersData);

  // Update the table
  const currentPage = parseInt(document.getElementById('currentPage').textContent.split(' ')[1]);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, usersData.length);
  const displayedUsers = usersData.slice(startIndex, endIndex);

  renderTable(displayedUsers);
  updatePagination(currentPage, Math.ceil(usersData.length / 10));
}






function deleteSelected() {
  const checkboxes = document.getElementsByClassName('userCheckbox');
  const selectedIds = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => parseInt(checkbox.getAttribute('data-id')));

  // Delete selected rows from in-memory data
  usersData = usersData.filter(user => !selectedIds.includes(user.id));

  // Update the table
  const currentPage = parseInt(document.getElementById('currentPage').textContent.split(' ')[1]);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, usersData.length);
  const displayedUsers = usersData.slice(startIndex, endIndex);

  renderTable(displayedUsers);
  updatePagination(currentPage, Math.ceil(usersData.length / 10));
}


function updatePagination(currentPage, totalPages) {
  const currentPageSpan = document.getElementById('currentPage');
  currentPageSpan.textContent = `Page ${currentPage} of ${totalPages}`;
}