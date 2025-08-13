import React from 'react';
import type { TimeComparison } from './types';
import { ClockIcon, FilmIcon, GlobeAltIcon, RocketLaunchIcon, ScaleIcon, SparklesIcon, FireIcon, MusicalNoteIcon, AcademicCapIcon, BuildingLibraryIcon } from './components/Icons';

export const TIME_COMPARISONS: TimeComparison[] = ([
  {
    name: "Wait for a text back",
    description: "The existential dread of the three dots...",
    durationMinutes: 1,
    category: 'Weird',
    icon: (props) => <ClockIcon {...props} />,
    humorousQuote: (times) => `You've endured the agony of waiting for a text back ${times} times. At least this has a happy ending.`
  },
  {
    name: "Listen to 'Stairway to Heaven'",
    description: "A classic rock epic. But is it forbidden?",
    durationMinutes: 8,
    category: 'Pop Culture',
    icon: (props) => <MusicalNoteIcon {...props} />,
    humorousQuote: (times) => `There's a lady who's sure all that glitters is gold, and she's heard you listen to Stairway ${times} times.`
  },
  {
    name: 'Boil the perfect egg',
    description: "It's a surprisingly delicate art.",
    durationMinutes: 10,
    category: 'Food',
    icon: (props) => <FireIcon {...props} />,
    humorousQuote: (times) => `You've mastered the culinary arts, boiling the equivalent of ${times} perfect eggs. A true master of your domain.`
  },
  {
    name: "The Anglo-Zanzibar War",
    description: "The shortest war in recorded history. Blink and you'll miss it.",
    durationMinutes: 38,
    category: 'History',
    icon: (props) => <ScaleIcon {...props} />,
    humorousQuote: (times) => `You've fought and won the shortest war in history ${times} times. Your blitzkrieg tactics are unparalleled.`
  },
  {
    name: "Listen to 'Dopesmoker' by Sleep",
    description: "A one-hour-plus journey into the heart of doom metal.",
    durationMinutes: 63,
    category: 'Pop Culture',
    icon: (props) => <MusicalNoteIcon {...props} />,
    humorousQuote: (times) => `You could have achieved doom metal enlightenment by listening to 'Dopesmoker' ${times} times. Proceed the weedian, Nazereth.`
  },
  {
    name: 'Build a standard IKEA bookshelf',
    description: "The true test of any relationship, even one with yourself.",
    durationMinutes: 120, // 2 hours
    category: 'Weird',
    icon: (props) => <BuildingLibraryIcon {...props} />,
    humorousQuote: (times) => `You could have assembled ${times} IKEA bookshelves, probably with fewer leftover screws and less existential dread.`
  },
  {
    name: "Watch 'Interstellar'",
    description: "A mind-bending trip through space, time, and love.",
    durationMinutes: 169,
    category: 'Pop Culture',
    icon: (props) => <FilmIcon {...props} />,
    humorousQuote: (times) => `You've spent enough time to watch 'Interstellar' ${times} times. Time dilation is a hell of a thing, isn't it?`
  },
  {
    name: 'Run a marathon (average time)',
    description: "The classic 26.2 mile endurance challenge.",
    durationMinutes: 262, // 4h 22min
    category: 'Endurance',
    icon: (props) => <SparklesIcon {...props} />,
    humorousQuote: (times) => `You've run the equivalent of ${times} marathons without leaving your room. Who needs Runner's High when you have... this.`
  },
  {
    name: 'Average NASA Spacewalk (EVA)',
    description: "Float in the void and fix a multi-billion dollar space can.",
    durationMinutes: 390, // 6.5 hours
    category: 'Science',
    icon: (props) => <RocketLaunchIcon {...props} />,
    humorousQuote: (times) => `That's ${times} successful missions outside the space station. You're an astronaut of the inner-space, a true pioneer.`
  },
  {
    name: 'Fly from New York to London',
    description: "A transatlantic hop across the pond.",
    durationMinutes: 420, // ~7 hours
    category: 'Endurance',
    icon: (props) => <GlobeAltIcon {...props} />,
    humorousQuote: (times) => `Forget the mile-high club, you've completed the equivalent of ${times} transatlantic flights. Hope you got window seats.`
  },
  {
    name: "Listen to the entire Beatles' studio album discography",
    description: "From 'Please Please Me' to 'Let It Be'. A magical mystery tour for your ears.",
    durationMinutes: 630, // Approx 10.5 hours
    category: 'Pop Culture',
    icon: (props) => <MusicalNoteIcon {...props} />,
    humorousQuote: (times) => `You could've gone on a Magical Mystery Tour ${times} times by listening to the entire Beatles discography.`
  },
  {
    name: "Watch 'The Lord of the Rings' (Extended Trilogy)",
    description: "One does not simply watch the theatrical versions.",
    durationMinutes: 686,
    category: 'Pop Culture',
    icon: (props) => <FilmIcon {...props} />,
    humorousQuote: (times) => `You could've walked to Mordor and back... or at least watched the entire Extended LOTR trilogy ${times} times. One does not simply... stop.`
  },
  {
    name: 'Cook a Competition-Winning Brisket',
    description: "Low and slow is the tempo. A true test of patience.",
    durationMinutes: 720, // 12 hours
    category: 'Food',
    icon: (props) => <FireIcon {...props} />,
    humorousQuote: (times) => `You've slow-cooked ${times} briskets to perfection. Your meat-rubbing skills are clearly well-practiced.`
  },
  {
    name: 'Complete a Full Iron Man Triathlon',
    description: "Swim 2.4 miles, bike 112 miles, run 26.2 miles. Consecutively.",
    durationMinutes: 17 * 60, // 17 hour cutoff
    category: 'Endurance',
    icon: (props) => <SparklesIcon {...props} />,
    humorousQuote: (times) => `An Iron Man has nothing on your endurance. You've completed the equivalent of ${times} races. Your chaffing must be legendary.`
  },
  {
    name: 'Longest filibuster in US Senate history',
    description: "Strom Thurmond's legendary 1957 stand against civil rights legislation.",
    durationMinutes: 1453, // 24h 13m
    category: 'History',
    icon: (props) => <ScaleIcon {...props} />,
    humorousQuote: (times) => `With this stamina, you could have blocked major legislation ${times} times with a record-breaking filibuster.`
  },
  {
    name: "Get a 'PADI' Scuba Diving Certification",
    description: "Learn to breathe underwater and explore a new world.",
    durationMinutes: 24 * 60, // ~4 days * 6 hours/day
    category: 'Endurance',
    icon: (props) => <RocketLaunchIcon {...props} />,
    humorousQuote: (times) => `You were exploring the depths... one way or another. You could be a certified scuba diver ${times} times over.`
  },
  {
    name: 'Read "War and Peace"',
    description: "Tolstoy's epic novel of Russian aristocracy and the Napoleonic Wars.",
    durationMinutes: 1800, // ~30 hours for avg reader
    category: 'Pop Culture',
    icon: (props) => <AcademicCapIcon {...props} />,
    humorousQuote: (times) => `You've conquered Tolstoy's "War and Peace" ${times} times. You understand the Russian soul on a profound level.`
  },
  {
    name: "Drive Route 66",
    description: "Get your kicks on the iconic highway from Chicago to Santa Monica.",
    durationMinutes: 50 * 60, // ~50 hours driving
    category: 'Endurance',
    icon: (props) => <GlobeAltIcon {...props} />,
    humorousQuote: (times) => `You've gotten your kicks on Route 66 a total of ${times} times. That's a lot of mileage.`
  },
  {
    name: "Watch all of 'The Office' (US)",
    description: "Bears. Beets. Battlestar Galactica. A journey into Dunder Mifflin.",
    durationMinutes: 4477, // 201 episodes * 22 mins
    category: 'Pop Culture',
    icon: (props) => <FilmIcon {...props} />,
    humorousQuote: (times) => `That's a lot of paper... and time. You could have binged all of The Office ${times} times.`
  },
  {
    name: "Watch every episode of 'Friends'",
    description: "Could you BE any more committed to 90s sitcoms?",
    durationMinutes: 5428, // 236 episodes * 23 mins
    category: 'Pop Culture',
    icon: (props) => <FilmIcon {...props} />,
    humorousQuote: (times) => `Could you BE any more dedicated? You've watched all of Friends ${times} times.`
  },
  {
    name: 'A single, epic D&D campaign',
    description: "Gather your party and venture forth. Or just do it yourself.",
    durationMinutes: 100 * 60, // ~100 hours
    category: 'Gaming',
    icon: (props) => <SparklesIcon {...props} />,
    humorousQuote: (times) => `You could have guided your party through an epic D&D campaign ${times} times. Roll for initiative.`
  },
  {
    name: 'The 100-hour war',
    description: "The 1969 conflict between El Salvador and Honduras, also known as the Football War.",
    durationMinutes: 100 * 60,
    category: 'History',
    icon: (props) => <ScaleIcon {...props} />,
    humorousQuote: (times) => `You have single-handedly outlasted the 100-hour war ${times} times. A true soldier of solitude.`
  },
  {
    name: 'Longest recorded continuous video game session',
    description: "A truly legendary display of stamina and questionable life choices.",
    durationMinutes: 138 * 60, // 138 hours
    category: 'Gaming',
    icon: (props) => <SparklesIcon {...props} />,
    humorousQuote: (times) => `You've beaten the world record for longest gaming session ${times} times. Your K/D ratio in life is... impressive.`
  },
  {
    name: "Watch the '24' series (All 9 seasons)",
    description: "The following takes place... over a very, very long time.",
    durationMinutes: 8784, // 204 episodes * 43 mins
    category: 'Pop Culture',
    icon: (props) => <ClockIcon {...props} />,
    humorousQuote: (times) => `You could have saved the world alongside Jack Bauer ${times} times. The fate of the free world rested in your hands.`
  },
  {
    name: "Make a sourdough starter from scratch",
    description: "Cultivate a living organism of yeast and bacteria to make bread.",
    durationMinutes: 10080, // 7 days
    category: 'Food',
    icon: (props) => <FireIcon {...props} />,
    humorousQuote: (times) => `You could have cultivated ${times} magnificent sourdough starters. Your yeast wrangling is second to none.`
  },
  {
    name: "The Cuban Missile Crisis",
    description: "The 13 days in 1962 that brought the world to the brink of nuclear war.",
    durationMinutes: 13 * 24 * 60, // 13 days
    category: 'History',
    icon: (props) => <ScaleIcon {...props} />,
    humorousQuote: (times) => `You've navigated tense standoffs with the same intensity as the Cuban Missile Crisis ${times} times. You averted nuclear war.`
  },
  {
    name: "The gestation period of an opossum",
    description: "Nature's quickest pregnancy. It's beautiful, in a weird way.",
    durationMinutes: 12 * 24 * 60, // 12 days
    category: 'Science',
    icon: (props) => <SparklesIcon {...props} />,
    humorousQuote: (times) => `In this time, you could have gestated ${times} litters of opossums. Nature is beautiful.`
  },
  {
    name: 'Beat The Legend of Zelda: Ocarina of Time',
    description: 'The Hero of Time has nothing on the Hero of Me Time.',
    durationMinutes: 30 * 60, // ~30 hours average playthrough
    category: 'Gaming',
    icon: (props) => <SparklesIcon {...props} />,
    humorousQuote: (times) => `You\'ve saved Hyrule from the evil clutches of Ganondorf ${times} times. A true hero.`
  },
  {
    name: 'A full season for a professional athlete',
    description: "The grueling 6-month journey of a pro sports season.",
    durationMinutes: 6 * 30 * 24 * 60, // ~6 months
    category: 'Endurance',
    icon: (props) => <SparklesIcon {...props} />,
    humorousQuote: (times) => `You've put in the hours of a pro athlete for ${times} seasons. You're in your prime.`
  },
  {
    name: 'Circumnavigate the Earth (by foot, Esteban-style)',
    description: "Juan Sebastián Elcano completed the first circumnavigation. It took a while.",
    durationMinutes: 2 * 365 * 24 * 60, // ~2 years
    category: 'History',
    icon: (props) => <GlobeAltIcon {...props} />,
    humorousQuote: (times) => `Magellan who? You've had enough time to walk around the entire globe ${times} times. Your calves must be magnificent.`
  },
  {
    name: 'Build the Parthenon (Phase 1: Foundation)',
    description: "Laying the groundwork for one of history's most iconic buildings.",
    durationMinutes: 3 * 365 * 24 * 60, // A guess for a phase, ~3 years
    category: 'History',
    icon: (props) => <BuildingLibraryIcon {...props} />,
    humorousQuote: (times) => `With this dedication, you could've laid the foundation for the Parthenon ${times} times. A monument to your... focus.`
  },
  {
    name: "Paint the Mona Lisa",
    description: "Leonardo da Vinci's masterpiece took years to complete.",
    durationMinutes: 4 * 365 * 24 * 60, // 4 years
    category: 'History',
    icon: (props) => <AcademicCapIcon {...props} />,
    humorousQuote: (times) => `Da Vinci's got nothing on you. You could have painted the Mona Lisa ${times} times, mysterious smile and all.`
  },
  {
    name: 'Get a PhD in Philosophy',
    description: "Pondering the great questions of existence for years on end.",
    durationMinutes: 5 * 365 * 24 * 60, // ~5 years
    category: 'History',
    icon: (props) => <AcademicCapIcon {...props} />,
    humorousQuote: (times) => `You could have pondered the great questions and earned a PhD in Philosophy ${times} times over. To fap, or not to fap? You've answered.`
  }
] as TimeComparison[]).sort((a, b) => a.durationMinutes - b.durationMinutes);
