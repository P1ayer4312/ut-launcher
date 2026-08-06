## Development

Required tools: `Node.js` v24 or above, `npm`

|                                   |                   |
| --------------------------------- | ----------------- |
| Install all required dependencies | `npm install`     |
| Starting the project              | `npm run start`   |
| Creating an executable            | `npm run package` |
|                                   |                   |

The project is split in two folders inside the `src/` directory:

- `backend/`
  - contains all the files used by Electron Forge
  - user data is handled and stored using `electron-store` defined in `userPreferences.ts`
  - IPC channels inside `preload.ts` are abstracted and handled using type definitions throughout the project, the `types` and `events` folders contain all handlers definitions
  - instructions for downloading and patching the games are defined inside the `workers` folder
  - the `config` folder contains predefined .ini files and additional configurations for each game
- `frontend/`
  - contains all React files for defining the user interface
  - the `contextBridge` object is used for communicating using IPC between the frontend and backend
  - `zustand` is used for state management defined in `useGlobalState.ts`

## Reporting Bugs

There's no planned communication channel at the moment, but if you want to report anything feel free to open a ticket inside the "Issues" tab on Github and I'll try to respond.
