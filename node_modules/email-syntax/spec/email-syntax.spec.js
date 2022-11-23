'use strict';
const emailSyntax = require('../lib/email-syntax').EmailSyntax;

describe('Common email addresses validations', function(){
    it('must be in form "local-part@domain-name"', () => {
        expect(emailSyntax.validate('abc@domain')).toBeTruthy();
        expect(emailSyntax.validate('abc@domain.com')).toBeTruthy();
        expect(emailSyntax.validate('abc@domain.net')).toBeTruthy();
        expect(emailSyntax.validate('abc@domain@domain2')).toBeFalsy();
        expect(emailSyntax.validate('')).toBeFalsy();
    });
    it('local part can be quoted like "abc"@domain.com', () => {
        expect(emailSyntax.validate('"abc"@domain.com')).toBeTruthy();
        expect(emailSyntax.validate('"ab"dc"@domain.com')).toBeFalsy();
        expect(emailSyntax.validate('"ab"dc@domain.com')).toBeFalsy();
    });
    it("can be in form 'abc@172.16.12.3'", () => {
        expect(emailSyntax.validate('abc@172.16.12.3')).toBeTruthy();
        expect(emailSyntax.validate('abc@172.16.abc.3')).toBeFalsy();
        expect(emailSyntax.validate('abc@111.222.333.44444')).toBeFalsy();
    });
    it("can't be '.email@domain.com'", () => {
        expect(emailSyntax.validate('.email@domain.com')).toBeFalsy();
    });
    it("can't be 'email.@domain.com'", () => {
        expect(emailSyntax.validate('email.@domain.com')).toBeFalsy();
    });
    it("can't be 'ema..il@domain.com'", () => {
        expect(emailSyntax.validate('ema..il@domain.com')).toBeFalsy();
    });
    it("can't be 'email@-domain.com'", () => {
        expect(emailSyntax.validate('email@-domain.com')).toBeFalsy();
        expect(emailSyntax.validate('email@-')).toBeFalsy();
        expect(emailSyntax.validate('email@--')).toBeFalsy();
    });
    it("can't be 'email@domain..com'", () => {
        expect(emailSyntax.validate('email@domain..com')).toBeFalsy();
    });
    it("can't be 'email@domain.c'", () => {
        expect(emailSyntax.validate('email@domain.c')).toBeFalsy();
    });
    it('can\'t be \'"em"ail"@domain.com\'', () => {
        expect(emailSyntax.validate('em"ail"@domain.com')).toBeFalsy();
    });
    it("can't be 'email@'", () => {
        expect(emailSyntax.validate('email@')).toBeFalsy();
        expect(emailSyntax.validate('email@ ')).toBeFalsy();
    });
    it("can't be '@domain.com'", () => {
        expect(emailSyntax.validate('@domain.com')).toBeFalsy();
    });
    it("can't be 'abc@...'", () => {
        expect(emailSyntax.validate('abc@...')).toBeFalsy();
        expect(emailSyntax.validate('abc@....')).toBeFalsy();
    });
});