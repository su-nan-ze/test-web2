import './main.js';

async function loadPeople() {
  const tableBody = document.getElementById('people-table-body');
  const filter = document.getElementById('people-filter');
  if (!tableBody || !filter) return;

  try {
    const response = await fetch('data/people.json');
    if (!response.ok) throw new Error(`Failed to load people: ${response.status}`);
    const people = await response.json();

    const roles = Array.from(new Set(people.map((person) => person.role))).sort();
    roles.forEach((role) => {
      const option = document.createElement('option');
      option.value = role;
      option.textContent = role;
      filter.appendChild(option);
    });

    const renderRows = () => {
      const selectedRole = filter.value;
      const fragment = document.createDocumentFragment();

      people
        .filter((person) => selectedRole === 'all' || person.role === selectedRole)
        .forEach((person) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td data-label="Name">${person.name}</td>
            <td data-label="Job Position">${person.position}</td>
            <td data-label="Email"><a href="mailto:${person.email}">${person.email}</a></td>
            <td data-label="Personal Website"><a href="${person.website}" target="_blank" rel="noopener">${person.website}</a></td>
          `;
          fragment.appendChild(row);
        });

      tableBody.innerHTML = '';
      tableBody.appendChild(fragment);
    };

    filter.addEventListener('change', renderRows);
    renderRows();
  } catch (error) {
    tableBody.innerHTML = '<tr><td colspan="4">Unable to load people data at this time.</td></tr>';
    console.error(error);
  }
}

loadPeople();
