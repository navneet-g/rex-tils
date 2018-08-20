import {
  isArray,
  isBlank,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isPresent,
  isString,
} from '../../guards'

// tslint:disable:no-magic-numbers

// tslint:disable-next-line:no-empty
const noop = () => {}
const emptyArr = [] as any[]
const emptyObj = {}

describe(`type guards`, () => {
  describe(`isArray`, () => {
    it(`should return true if value is an Array`, () => {
      expect(isArray(123)).toBe(false)
      expect(isArray(emptyObj)).toBe(false)
      expect(isArray({ one: 1 })).toBe(false)

      expect(isArray(emptyArr)).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)

      const arrWithTypes = [1, 2, 3] as number[] | string
      const arrWithComplexTypes = [{ who: 'Me' }] as
        | Array<{ who: string }>
        | string

      if (isArray(arrWithTypes)) {
        // $ExpectType number[]
        expect(arrWithTypes[0].toString()).toBe('1')
      } else {
        arrWithTypes.toString()
      }

      if (isArray(arrWithComplexTypes)) {
        // $ExpectType Array<{ who: string }>
        expect(arrWithComplexTypes[0].who).toBe('Me')
      } else {
        arrWithTypes.toString()
      }
    })
  })

  describe(`isObject`, () => {
    it(`should return false if value is not an object map`, () => {
      expect(isObject(123)).toBe(false)
      expect(isObject('hello')).toBe(false)
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(noop)).toBe(false)
      expect(isObject(emptyArr)).toBe(false)

      expect(isObject(emptyObj)).toBe(true)
      expect(isObject({ one: 1 })).toBe(true)
    })
  })

  describe(`isFunction`, () => {
    it(`should return true if value is function`, () => {
      expect(isFunction(emptyArr)).toBe(false)
      expect(isFunction(emptyObj)).toBe(false)

      expect(isFunction(noop)).toBe(true)

      type FnDefinition = (count: number, who: string) => string
      const fnImplementation: FnDefinition | any[] = ((
        count: number,
        who: string
      ) => `${who}: ${count} times`) as any

      if (isFunction(fnImplementation)) {
        // $ExpectType (count: number, who: string) => `${who}: ${count} times`
        expect(typeof fnImplementation).toBe('function')
        expect(fnImplementation(3, 'Me')).toBe('Me: 3 times')
      } else {
        // @ts-ignore
        expect(() => fnImplementation(3, 'Me')).toThrow()
      }
    })
  })

  describe(`isNumber`, () => {
    it(`should return true if value is number, NaN, Infinity`, () => {
      expect(isNumber(123)).toBe(true)
      expect(isNumber(NaN)).toBe(true)
      expect(isNumber(Infinity)).toBe(true)
      expect(isNumber(-1)).toBe(true)
      expect(isNumber('123')).toBe(false)
    })
  })

  describe(`isBoolean`, () => {
    it(`should return true if value is boolean`, () => {
      expect(isBoolean(false)).toBe(true)
      expect(isBoolean(true)).toBe(true)

      expect(isBoolean('hello')).toBe(false)
      expect(isBoolean(-1)).toBe(false)
      expect(isBoolean(123)).toBe(false)
    })
  })

  describe(`isString`, () => {
    it(`should return true if value is string`, () => {
      expect(isString(false)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(-1)).toBe(false)
      expect(isString(123)).toBe(false)

      expect(isString('hello')).toBe(true)
      expect(isString('')).toBe(true)
    })
  })

  describe(`isPresent`, () => {
    it(`should return true if value is present (non nullable, non undefined)`, () => {
      expect(isPresent(false)).toBe(true)
      expect(isPresent(true)).toBe(true)
      expect(isPresent(-1)).toBe(true)
      expect(isPresent(123)).toBe(true)
      expect(isPresent('hello')).toBe(true)
      expect(isPresent('')).toBe(true)
      expect(isPresent(emptyArr)).toBe(true)
      expect(isPresent(emptyObj)).toBe(true)

      expect(isPresent(null)).toBe(false)
      expect(isPresent(undefined)).toBe(false)

      const value = 'wat' as undefined | null | string

      if (isPresent(value)) {
        expect(typeof value).toBe('string')
      } else {
        // $ExpectType null | undefined
        // @ts-ignore
        expect(() => value.toString()).toThrow()
      }
    })

    describe(`isBlank`, () => {
      it(`should return true if value is blank (non null or undefined)`, () => {
        expect(isBlank(false)).toBe(false)
        expect(isBlank(true)).toBe(false)
        expect(isBlank(-1)).toBe(false)
        expect(isBlank(123)).toBe(false)
        expect(isBlank('hello')).toBe(false)
        expect(isBlank('')).toBe(false)
        expect(isBlank(emptyArr)).toBe(false)
        expect(isBlank(emptyObj)).toBe(false)

        expect(isBlank(null)).toBe(true)
        expect(isBlank(undefined)).toBe(true)

        const value = null as undefined | null | string

        if (isBlank(value)) {
          // $ExpectType null | undefined
          // @ts-ignore
          expect(() => value.toString()).toThrow()
        } else {
          // $ExpectType string
          expect(typeof value).toBe('string')
          expect(() => value.toString()).toThrow()
        }
      })
    })
  })
})