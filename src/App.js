/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

// Emotion Styling
const heading = css`
  font-weight: 700;
`;

const nameInputFields = css`
  margin-right: 10px;
  width: 200px;
  transition: 180ms width ease-in-out;
  :focus {
    width: 250px;
  }
`;

const yourGuestsBox = css`
  background-color: #9dbcd4;
  padding: 10px 15px 20px;
  box-shadow: 10px 10px;
  width: 700px;
`;

const guestItem = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 400px;
  div {
    font-weight: 200;
  }
`;

const removeButtons = css`
  font-weight: 200;
  font-family: 'Cairo Play', cursive;
  border: 0.5px solid grey;
  border-radius: 2px;
  width: 80px;
  transition: 180ms width ease-in-out;
  transition: font-weight ease-in-out;
  :hover {
    background-color: lightcoral;
    width: 90px;
    font-weight: 400;
  }
`;

function App() {
  // Definitions
  const baseUrl =
    'https://28f51e24-1fa9-4952-9b77-09213d1f0356.id.repl.co/guests';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all guests
  async function getAllGuests() {
    setLoading(true);
    const response = await fetch(baseUrl);
    setLoading(false);
    const allGuests = await response.json();
    setGuests(allGuests);
  }

  // Call getAllGuests() on first Load
  useEffect(() => {
    getAllGuests().catch(() => {});
  }, []);

  // Delete a guest from the guest list
  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log('Your guest has been DELETED from the list:', deletedGuest);
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
    console.log('Your guest has been ADDED to the list:', data);
    setFirstName('');
    setLastName('');
    await getAllGuests();
  }

  // Update a guests status from 'not attending' to 'attending' on checkbox change (checked = attending, unchecked = not attending)
  async function inviteGuest(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: true }),
    });
    const updatedGuest = await response.json();
    console.log('Your guest is set to ATTENDING now:', updatedGuest);
    // Get all guests again after setting one to 'attending'
    await getAllGuests();
  }

  // Update a guests status from 'attending' to 'not attending' on checkbox change (checked = attending, unchecked = not attending)
  async function unInviteGuest(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: false }),
    });
    const updatedGuest = await response.json();
    console.log('Your guest is set to NOT attending now:', updatedGuest);
    // Get all guests again after setting one to 'attending'
    await getAllGuests();
  }

  return (
    <div>
      <h1 css={heading}>Guest List</h1>
      {/* INPUT FORM */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label>
          First name
          <input
            css={nameInputFields}
            value={firstName}
            disabled={loading}
            onChange={(event) => {
              setFirstName(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Last name
          <input
            css={nameInputFields}
            value={lastName}
            disabled={loading}
            onChange={(event) => {
              setLastName(event.currentTarget.value);
            }}
            onKeyPress={async (event) =>
              event.key === 'Enter' ? await createGuest() : null
            }
          />
        </label>
      </form>
      <p>Press enter to submit your guest</p>
      {/* GUEST LIST  */}
      <div css={yourGuestsBox}>
        {/* Map over the fetched array of guests to display */}
        {loading ? <>Loading...</> : <h2 css={heading}>Your guests</h2>}
        {guests.map((guest) => {
          return (
            <div key={guest.id} data-test-id="guest" css={guestItem}>
              {/* Guests names */}
              <span>
                {guest.firstName} {guest.lastName}
              </span>
              {/* Attendance Checkbox */}
              <div>
                <input
                  aria-label={`attending status of ${guest.firstName} ${guest.lastName}`}
                  checked={guest.attending}
                  type="checkbox"
                  onChange={async (event) => {
                    const newState = event.currentTarget.checked;
                    if (newState === true) {
                      await inviteGuest(guest.id);
                    } else {
                      await unInviteGuest(guest.id);
                    }
                  }}
                />
                {guest.attending ? 'attending' : 'not attending'}
              </div>
              {/* Remove button */}
              <button
                aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                css={removeButtons}
                onClick={async () => {
                  await deleteGuest(guest.id);
                  // Get all guests again after deleting one
                  await getAllGuests();
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
