import { useEffect, useState } from 'react';

function App() {
  // Definitions
  const baseUrl =
    'https://28f51e24-1fa9-4952-9b77-09213d1f0356.id.repl.co/guests';
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [guests, setGuests] = useState([]);
  // const [attendingState, setAttendingState] = useState([]);

  // Get all guests
  async function getAllGuests() {
    const response = await fetch(baseUrl);
    const allGuests = await response.json();
    setGuests(allGuests);
  }

  useEffect(() => {
    getAllGuests().catch(() => {});
  }, []);

  // Delete a guest from the guest list
  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
  }

  // Store new guest in API
  async function createGuest() {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const data = await response.json();
    console.log(data);
    setFirstName('');
    setLastName('');
    await getAllGuests();
  }

  // Update a guests status from 'not attending' to 'attending' on checkbox change (checked = attending, unchecked = not attending)
  async function updateGuest(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: true }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
    await getAllGuests();
  }

  async function unUpdateGuest(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: false }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
    await getAllGuests();
  }

  return (
    <div>
      <h1>Guest List</h1>
      {/* Form for guest input */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <input
          aria-label="First Name"
          value={firstName}
          onChange={(event) => {
            setFirstName(event.currentTarget.value);
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
          onKeyPress={async (event) =>
            event.key === 'Enter' ? await createGuest() : null
          }
        />
        <br />
        <p>Press enter to submit your guest</p>
      </form>
      <br />
      <br />
      <br />
      <table>
        {/* Head of the Guest List */}
        <thead>
          <tr>
            <th>First & Last Name</th>
            <th>Status of Attendance </th>
            <th>Removal</th>
          </tr>
          {/* Guests from API */}
          {guests.map((guest) => {
            return (
              <tr key={guest.id}>
                <td>
                  {guest.firstName} {guest.lastName}
                </td>
                <td>
                  <input
                    checked={guest.attending}
                    type="checkbox"
                    onChange={async (event) => {
                      const newState = event.currentTarget.checked;
                      if (newState === true) {
                        await updateGuest(guest.id);
                      } else {
                        await unUpdateGuest(guest.id);
                      }
                    }}
                  />
                </td>
                <td>
                  <button
                    onClick={async () => {
                      await deleteGuest(guest.id);
                      await getAllGuests();
                      console.log(`${baseUrl}/${guest.id}`);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}

          {/* <tr key={newGuest.id}>
            <td>
              {newGuest.firstName} {newGuest.lastName}
            </td>
            <td>
              {attendingState}
              <input
                checked={checkBoxValue}
                type="checkbox"
                onChange={async (event) => {
                  const checked = event.currentTarget.checked;
                  setCheckBoxValue(checked);
                  if (checked) {
                    setAttendingState('attending');
                    await updateGuest();
                  } else {
                    setAttendingState('not attending');
                  }
                }}
              />
            </td>
            <td>
              <button>Remove</button>
            </td>
          </tr> */}
        </thead>
      </table>
    </div>
  );
}

export default App;
