import AudioBuffer from '../audioBuffer/index';
import Level       from '../index';
import Note        from '../note/index';
import NoteTrigger from '../noteTrigger/index';
import Section     from '../section/index';

export default args => {
  const level = new Level(args);
  level.bpm = 120;
  level.name = "Open The Gates";
  level.difficulty = 3;

  const notes = [
    new Note({
      audioContext    : level.audioContext,
      color           : 'red',
      masterAudioNode : level.masterAudioNode,
      radius          : level.radius,
      url             : 'level-2/note-1.mp3',
    }),
    new Note({
      audioContext    : level.audioContext,
      color           : 'orange',
      masterAudioNode : level.masterAudioNode,
      radius          : level.radius,
      url             : 'level-2/note-2.mp3',
    }),
    new Note({
      audioContext    : level.audioContext,
      color           : 'yellow',
      masterAudioNode : level.masterAudioNode,
      radius          : level.radius,
      url             : 'level-2/note-3.mp3',
    }),
    new Note({
      audioContext    : level.audioContext,
      color           : 'green',
      masterAudioNode : level.masterAudioNode,
      radius          : level.radius,
      url             : 'level-2/note-4.mp3',
    }),
    new Note({
      audioContext    : level.audioContext,
      color           : 'blue',
      masterAudioNode : level.masterAudioNode,
      radius          : level.radius,
      url             : 'level-2/note-5.mp3',
    }),
      new Note({
      audioContext    : level.audioContext,
      color           : 'indigo',
      masterAudioNode : level.masterAudioNode,
      radius          : level.radius,
      url             : 'level-2/note-6.mp3',
    }),
    new Note({
      audioContext    : level.audioContext,
      color           : 'violet',
      masterAudioNode : level.masterAudioNode,
      radius          : level.radius,
      url             : 'level-2/note-7.mp3',
    }),
  ];

  const noteTriggers = [
    new NoteTrigger({
      beats          : 8,
      bpm            : level.bpm,
      masterAudioNode: level.masterAudioNode,
      position       : Math.PI,
      radius         : level.radius,
      startDelay     : 0,
    }),
    new NoteTrigger({
      beats          : 8,
      bpm            : level.bpm,
      masterAudioNode: level.masterAudioNode,
      position       : 0,
      radius         : level.radius,
      startDelay     : 4,
    }),
  ];

  level.sections = [
    new Section({
      audioContext : level.audioContext,
      beats : 32,
      beatCounter : 32,
      bpm : level.bpm,
      masterAudioNode : level.masterAudioNode,
      unlockPattern : [0, 1, 2, 3],
      url : 'level-2/bg-1.mp3',
      notes,
      noteTriggers,
    }),
    new Section({
      audioContext : level.audioContext,
      beats : 32,
      beatCounter : 32,
      bpm : level.bpm,
      masterAudioNode : level.masterAudioNode,
      unlockPattern : [4, 5, 6, 0],
      url : 'level-2/bg-2.mp3',
      notes,
      noteTriggers,
    }),
    new Section({
      audioContext : level.audioContext,
      beats : 32,
      beatCounter : 32,
      bpm : level.bpm,
      masterAudioNode : level.masterAudioNode,
      unlockPattern : [0, 2, 3, 1],
      url : 'level-2/bg-3.mp3',
      notes,
      noteTriggers,
    }),
    new Section({
      audioContext : level.audioContext,
      beats : 32,
      beatCounter : 32,
      bpm : level.bpm,
      masterAudioNode : level.masterAudioNode,
      unlockPattern : [0, 2, 4, 6],
      url : 'level-2/bg-4.mp3',
      notes,
      noteTriggers,
    }),
    new Section({
      audioContext : level.audioContext,
      beats : 32,
      beatCounter : 32,
      bpm : level.bpm,
      masterAudioNode : level.masterAudioNode,
      unlockPattern : [1, 3, 5, 6],
      url : 'level-2/bg-4.mp3',
      notes,
      noteTriggers,
    }),
  ];

  return level;
}
