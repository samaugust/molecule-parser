//Regex which captures the characters enclosed within the last (and most nested) brackets, parentheses, or curly braces

const unify = /(\(|\[|\{)(?=[^([{]*$)([^)\]}]+)(\)|\}|\])(\d*)/;

//Separates the atomic element's symbol from its quantity and returns an object e.g. "Na2" becomes {abbrev: Na, quant: 2}

const parseAtoms = str => {
  return {quant: str.match(/\d+/) ? +str.match(/\d+/)[0] : 1 , 
    abbrev: /\D+/.exec(str)[0]};
};

//Parses the molecular compound when it still contains parens/brackets/curlies e.g. "(S4O2)2" becomes "S8O4"

const complexParse = str => {
  let match = unify.exec(str);
  if (match) {
    return match[2].split(/(?=[A-Z])/).reduce((a,b)=> {
      let atom = parseAtoms(b);
      return a + atom.abbrev + (atom.quant * (match[4] || 1));
    },'');    
  }
};

//Parses the molecular compound into a JSON object when there are no parens/brackets/curlies e.g. "S4Na8" becomes {S: 4, Na: 8}

const simpleParse = str => {
  return str.split(/(?=[A-Z])/).reduce((a,b)=>{
    let atom = parseAtoms(b);
    a[atom.abbrev] = a[atom.abbrev] ? a[atom.abbrev] + atom.quant : atom.quant;
    return a;
  },{});
};

//Master function

const parseMolecule = formula => {
  while (unify.exec(formula)) {
    formula = formula.replace(unify, complexParse);
  }
  return simpleParse(formula);
}

//test cases

var test1 = 'K4{(O3N)3(SO3AgCt5)2}2';

var test2 = '{KO}2';

var test3 = 'Mg{K4[(O2(SO3(AgCt)5)2)7]2}9';

var test4 = '(C5H5)Fe(CO)2CH3';

var test5 = '{[Co(NH3)4(OH)2]3Co}(SO4)3';

var tests = [test1, test2, test3, test4, test5];

for (let t of tests) {
  console.log(parseMolecule(t));
}