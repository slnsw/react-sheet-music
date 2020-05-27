const header = 'X:1\nM:4/4\nK:A\nL:1/4\n%%score 1 2 | 3\n';
const lines = [
  'V:1 name="VOICE"',
  '|"_Con Spirito alla Marcia." z4|z4|z4|',
  '|z4|E A/ c/ B G/F/|E e c2|',
  'w:||1.~Our Sail~-or Prince thy|no~-ble ship|',
  'w:||2.~Our Sail~-or Prince we|wel~-come Thee|',
  '|A G/ B/ E F|G2 z2|E A/ c/ B G/F/|',
  "w:|Hath cleft the o~-cean's|foam,|And brought Thee safe~-ly|",
  'w:|With fes~-tive shout and|cheer,|For thy sake and thy|',
  '|E e c2|A F/ B/ E G|A2 z2|',
  'w:|to the shores|Of our Aust~- tra~- lian|home,|',
  'w:|Mo~- thers’ sake|The Queen to us so|dear,|',
  '|E c/ B/4A/4 e c|d A B3/2 c/|E F A B|',
  'w:|Hail to the * might~- ty|Land of Gold, Of|wav~- ing corn and|',
  'w:|In this fair * south~- ern|Land of ours, Through|o~- cean rolls be~-|',
  '|G2 z2|E c/ B/4A/4 e c|d A B2|',
  'w:|vine|Of count-less * mul~- ti~-|tudes of sheep|',
  'w:|tween|Our shores and * dear old|Eng~- land’s shores|',
  '|c e/ E/ !fermata!c3/2 B/|A2 z2|z4|z4|',
  'w:|And count less herds of|kine.|||',
  'w:|We still re~- vere the|Queen.|||',

  'V:2 clef=treble name="PIANO-"',
  "|[Ee] [Aa] [cc'] [B/b][A/a]|[Bb] [ee'] [c2c'2]|[Aa] [F/f][B/b] [cc'] [Bb]|",
  '|[Aa] [CEA] z [CEA]|z [CEA] z [B,DG]|z [B,DE] z [CEc]|',
  '|[A,/E/A/] z/ [D/E/G/] z/ [C/E/A/] z/ [C/F/c/] z/|z [^DG^B] z [=DG=B]|z [CEA] z [B,DG]|',
  '|z [B,EB] z [CEA]|[A,/E/A/] z/ [D/F/B/] z/ [C/E/A/] z/ [D/G/E/] z/|[C/E/A] z/ c/>e/ A/ z/2 z|', //  & z (EA E) z
  '|z [C/E/A/] z/ [B,/E/B/] z/ [C/E/A/] z/| z [A,^DA] [B,=DA] G/F/|E [A,DF] [A,DA] [DFB]|',
  '|[B,EG] [EBd] [Ac] [EGB]|z [CEA] z [CEA]|z [A,DA] z [B,^DA]|',
  '|[CEA] [A,EA] !fermata![B,^DA] [B,=DG]|[CA] ((3E/A/c/) e E|[EF] A/>d/ [Ec] ((3e/d/c/)|[EA] [CE] [CA] z|',

  'V:3 clef=bass name="FORTE"',
  '|A,, [E,A,C] A,, [E,A,C]|G,, [E,G,D] A,, [E,A,C]|[C,,C,] [D,F,B,] [E,,E,] [E,G,D]|',
  '|[A,,A,] z [A,,E,A,] z |[A,,A,] z [E,,E,] z|[G,,G,] z [A,,A,] z|',
  '|[C,,/C,/] z/ [B,,,/B,,/] z/ [A,,,/A,,/] z/ [A,,/A,/] z/|[G,,G,] z [E,,E,] z|[A,,A,] z [E,,E,] z|',
  '|[G,,G,] z [A,,A,] z|[C,,/C,/] z/ [D,,/D,/] z/ [E,,/E,/] z/ [E,,/E,/] z/|[A,,/A,/] z/ ([A,C] [A,/C/]) z/ z|',
  '|[A,,A,] z [G,,/G,/] z/ [A,,/A,/] z/ |[F,,2F,2] [E,,3/2E,3/2] [D,,/D,/]|[C,,C,] [D,,D,] [F,,F,] [D,,D,]|',
  '|[E,,E,] E,2 E,|[A,,A,] z [=G,,=G,] z|[F,,F,] z [=F,,=F,] z|',
  '|[E,,E,] [C,,C,] !fermata![B,,,B,,] [E,,E,]|[A,,A,] [C,2A,2] [C,A,]|[D,A,] [F,A,] [E,A,] [E,B,D]|[A,C] [A,EA] [A,EA] z|',
];

const cooleys =
  'X:1\nT: Cooley\'s\nM: 4/4\nL: 1/8\nR: reel\nK: Emin\nD2|:"Em"EB{c}BA B2 EB|~B2 AB dBAG|"D"FDAD BDAD|FDAD dAFD|\n"Em"EBBA B2 EB|B2 AB defg|"D"afe^c dBAF|1"Em"DEFD E2 D2:|2"Em"DEFD E2 gf||\n|:"Em"eB B2 efge|eB B2 gedB|"D"A2 FA DAFA|A2 FA defg|\n"Em"eB B2 eBgB|eB B2 defg|"D"afe^c dBAF|1"Em"DEFD E2 gf:|2"Em"DEFD E4|]\n';
const chorus =
  'X:1\nT: Chorus\nV: T1 clef=treble name="Soprano"\nV: T2 clef=treble name="Alto"\nV: B1 clef=bass name="Tenor"\nV: B2 clef=bass name="Bass"\nL:1/8\nK:G\nP:First Part\n[V: T1]"C"ed"Am"ed "F"cd"G7"gf |\n[V: T2]GGAA- A2BB |\n[V: B1]C3D- DF,3 |\n[V: B2]C,2A,,2 F,,2G,,2 |';
const bigNotes = 'X:1\nM: 4/4\nL: 1/8\nK: Emin\n|:D2|EB{c}BA B2 EB|\n';

const songs = [
  {
    title: 'National Song: Our Sailor Prince',
    creator: 'Neild, J. C',
    url: 'https://collection.sl.nsw.gov.au/digital/file/06ddDNk67LV8G',
    imageUrl:
      'https://files02.sl.nsw.gov.au/fotoweb/thumbnails/300_0/3750/37501760.jpg',
    notation: header + lines.join('\n'),
    bpm: 90,
  },
];

export default songs;
