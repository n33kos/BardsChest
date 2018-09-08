import AudioBuffer from '../audioBuffer/index';
import Level       from '../index';
import Note        from '../note/index';
import NoteTrigger from '../noteTrigger/index';
import Section     from '../section/index';

export default args => {
  const level = new Level(args);

  level.bpm = 110;
  level.sections = [
    new Section({
      audioContext : level.audioContext,
      beats : 32,
      beatCounter : 32,
      bpm : level.bpm,
      masterAudioNode : level.masterAudioNode,
      unlockPattern : [1, 2, 3, 0, 1, 2, 3, 0],
      url : 'level-1/testbg.mp3',
      notes : [
        new Note({
          audioContext    : level.audioContext,
          color           : 'yellow',
          masterAudioNode : level.masterAudioNode,
          radius          : level.radius,
          url             : 'level-1/note-1.mp3',
        }),
        new Note({
          audioContext    : level.audioContext,
          color           : 'green',
          masterAudioNode : level.masterAudioNode,
          radius          : level.radius,
          url             : 'level-1/note-2.mp3',
        }),
        new Note({
          audioContext    : level.audioContext,
          color           : 'blue',
          masterAudioNode : level.masterAudioNode,
          radius          : level.radius,
          url             : 'level-1/note-3.mp3',
        }),
        new Note({
          audioContext    : level.audioContext,
          color           : 'indigo',
          masterAudioNode : level.masterAudioNode,
          radius          : level.radius,
          url             : 'level-1/note-4.mp3',
        }),
      ],
      noteTriggers : [
        new NoteTrigger({
          beats          : 8,
          masterAudioNode: level.masterAudioNode,
          noteDuration   : 100,
          position       : 0,
          radius         : level.radius,
          startDelay     : 0,
        }),
      ],
    }),
  ];

  return level;
}
