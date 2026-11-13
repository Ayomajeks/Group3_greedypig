
const API_URL = "http://localhost:5000";

const STORAGE_KEY = "greedyPigRegisteredPlayers";

// Retrieve previously registered players from this browser.
export function getRegisteredPlayers() {
  try {
    const savedPlayers = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedPlayers) ? savedPlayers : [];
  } catch {
    return [];
  }
}

function saveRegisteredPlayers(players) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

async function verifySavedIdentity(identity) {
  if (!identity.playerId || !identity.token) {
    return false;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${identity.token}`,
    },
  });

  if (response.ok) {
    const result = await response.json();
    return result.data?.player?.id === identity.playerId;
  }

  if (response.status === 401 || response.status === 404) {
    return false;
  }

  const result = await response.json().catch(() => ({}));
  throw new Error(result.message || "Could not verify saved player identity.");
}

// Register a participant or reuse their existing identity.
export async function registerLeaderboardPlayer(username) {
  const cleanUsername = username.trim();

  const registeredPlayers = getRegisteredPlayers();

  const existingPlayer = registeredPlayers.find(
    (player) =>
      typeof player.username === "string" &&
      player.username.toLowerCase() === cleanUsername.toLowerCase()
  );

  // Reuse the existing identity if this browser already has it.
  if (existingPlayer) {
    const isValid = await verifySavedIdentity(existingPlayer);

    if (!isValid) {
      throw new Error(
        `${cleanUsername}'s saved session is missing or expired. This username cannot be reused without its valid saved identity.`
      );
    }

    return existingPlayer;
  }

  const response = await fetch(`${API_URL}/auth/guest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: cleanUsername }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not register player");
  }

  const registeredPlayer = {
    username: result.data.player.username,
    playerId: result.data.player.id,
    token: result.data.token,
  };

  // Re-read storage after the request so concurrent setup registrations do not
  // overwrite identities saved by earlier requests.
  const latestRegisteredPlayers = getRegisteredPlayers();
  const alreadySaved = latestRegisteredPlayers.some(
    (player) => player.playerId === registeredPlayer.playerId
  );

  if (!alreadySaved) {
    saveRegisteredPlayers([...latestRegisteredPlayers, registeredPlayer]);
  }

  return registeredPlayer;
}
