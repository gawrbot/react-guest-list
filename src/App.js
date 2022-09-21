import { useEffect, useState } from 'react';

function App() {
  // Define Guest List API url
  const baseUrl =
    'https://28f51e24-1fa9-4952-9b77-09213d1f0356.id.repl.co/guests/';

  const [firstName, setFirstName] = useState([]);
  const [lastName, setLastName] = useState([]);

  // Store new guest in API
  async function createGuest() {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Rhea',
        lastName: 'dieberger',
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  // Update a guests status from 'not attending' to 'attending'
  async function updateGuest() {
    const response = await fetch(`${baseUrl}2`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: true }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
  }

  // Delete a guest completely from the guest list
  async function deleteGuest() {
    const response = await fetch(`${baseUrl}1`, { method: 'DELETE' });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
  }

  return (
    <div>
      <h1>Guest List</h1>
      <input
        aria-label="First Name"
        value={firstName}
        onChange={(event) => {
          setFirstName(event.currentTarget.value);
        }}
        onKeyPress={(event) => {
          event.key === 'Enter' && console.log(firstName);
        }}
      />
      <br />
      <br />
      <input
        aria-label="Last Name"
        value={lastName}
        onChange={(event) => {
          setLastName(event.currentTarget.value);
        }}
        onKeyPress={(event) => {
          event.key === 'Enter' && console.log(lastName);
        }}
      />
      <br />
      <br />
      <button
        onClick={() => {
          updateGuest().catch(() => {});
        }}
      >
        Send
      </button>
      <table>
        <tr>
          <th>First Name</th>
          <br />
          <br />
          <th>Last Name</th>
          <br />
          <br />
          <th>Status of Attendance</th>
        </tr>
      </table>
    </div>
  );
}

export default App;
