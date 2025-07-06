# Game Audio Files

This folder contains all the sound effects used in the math-science mini games.

## Audio Files
- correct.mp3: Played when a user answers correctly (cheer sound)
- wrong.mp3: Played when a user answers incorrectly (gentle alert)
- snap.mp3: Played when a dragged item is placed correctly (snap/pop sound)
- fail.mp3: Played when a dragged item is placed incorrectly (boing/soft error)
- win.mp3: Played when a puzzle is completed (win jingle)
- start_warmup.mp3: Played at the beginning of warm-up activities (soft chime)
- start_core.mp3: Played at the beginning of core game (excited tone)
- myth_bust.mp3: Played during myth-bust reveals (magical whoosh)
- wrap_up.mp3: Played at the end of wrap-up activities (closing sound)
- click.mp3: Played for button/UI interactions (click/tap feedback)
- bg_loop.mp3: Optional background music loop

## Usage
These audio files are referenced in the game components using the SoundPlayer component.
Example usage:
```jsx
import { playSoundEffect } from '../../common/SoundPlayer';

// Play a sound effect
playSoundEffect('correct.mp3');
```

Note: All audio files should be in MP3 format for best browser compatibility. 