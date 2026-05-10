export const NEET_SYLLABUS = {
  physics: {
    name: 'Physics',
    topics: [
      'Kinematics',
      'Laws of Motion',
      'Work, Energy and Power',
      'Rotational Motion',
      'Gravitation',
      'Properties of Bulk Matter',
      'Thermodynamics',
      'Kinetic Theory of Gases',
      'Oscillations and Waves',
      'Electrostatics',
      'Current Electricity',
      'Magnetic Effects of Current and Magnetism',
      'Electromagnetic Induction and Alternating Currents',
      'Electromagnetic Waves',
      'Optics',
      'Dual Nature of Matter and Radiation',
      'Atoms and Nuclei',
      'Electronic Devices'
    ]
  },
  chemistry: {
    name: 'Chemistry',
    topics: [
      'Some Basic Concepts of Chemistry',
      'Structure of Atom',
      'Classification of Elements and Periodicity in Properties',
      'Chemical Bonding and Molecular Structure',
      'States of Matter: Gases and Liquids',
      'Thermodynamics',
      'Equilibrium',
      'Redox Reactions',
      'Hydrogen',
      's-Block Elements (Alkali and Alkaline earth metals)',
      'Some p-Block Elements',
      'Organic Chemistry-Some Basic Principles and Techniques',
      'Hydrocarbons',
      'Environmental Chemistry',
      'Solid State',
      'Solutions',
      'Electrochemistry',
      'Chemical Kinetics',
      'Surface Chemistry',
      'Isolation of Elements',
      'p-Block Elements',
      'd and f Block Elements',
      'Coordination Compounds',
      'Haloalkanes and Haloarenes',
      'Alcohols, Phenols and Ethers',
      'Aldehydes, Ketones and Carboxylic Acids',
      'Organic Compounds Containing Nitrogen',
      'Biomolecules',
      'Polymers',
      'Chemistry in Everyday Life'
    ]
  },
  botany: {
    name: 'Botany',
    topics: [
      'Diversity in Living World',
      'Structural Organisation in Plants',
      'Cell Structure and Function',
      'Plant Physiology',
      'Reproduction in Plants',
      'Genetics and Evolution',
      'Biology and Human Welfare (Botany parts)',
      'Ecology and Environment'
    ]
  },
  zoology: {
    name: 'Zoology',
    topics: [
      'Structural Organisation in Animals',
      'Human Physiology',
      'Reproduction in Animals',
      'Genetics and Evolution (Zoology parts)',
      'Biology and Human Welfare (Zoology parts)',
      'Biotechnology and Its Applications'
    ]
  }
};

export type SubjectKey = keyof typeof NEET_SYLLABUS;
