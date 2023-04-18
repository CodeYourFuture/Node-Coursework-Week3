let s, u;
/**
 * 
 * @description validates the given parameter as an email; true for valid emails, false for invalid emails. only form is checked, not whether or not the domain exists/works/etc. Note, this does not validate characters either due to RFC 3490, but it will validate for syntax, see https://stackoverflow.com/a/2071250
 * @param {any} potentialEmail
 */
const validate = (potentialEmail) => (
  potentialEmail //will avoid stuff like an empty string causing a bunch of useless checks to run
  && typeof potentialEmail === "string"
  && ((s = potentialEmail.indexOf("@")) !== -1)
  && ((u = potentialEmail.indexOf(".")) !== -1)
  && s < u
  && potentialEmail.slice(0, s)?.length //0 = falsy, 1 = truthy
  && (u = potentialEmail.slice(s)?.split?.("."))
  && u?.length === 2
  && u[0]?.length
  && u[1]?.length
);

module.exports = {
 validate: validate 
}
