import { isSrc, isObj } from '../src/utils'

test('util: is-obj', () => {
  expect(isObj({ a: 1 })).toBeTruthy()
  expect(isObj(null)).toBeFalsy()
  expect(isObj('123')).toBeFalsy()
  expect(isObj([1, 2])).toBeTruthy()
})

test('util: is-src', () => {
  expect(isSrc('http://img.cdn.com')).toBeTruthy()
  expect(isSrc('https://img.cdn.com')).toBeTruthy()
  expect(isSrc('//img.cdn.com')).toBeTruthy()
  expect(isSrc('data:image/jpeg;base64,/9j/4AAQSkZ')).toBeTruthy()
  expect(isSrc('img.cdn.com')).toBeFalsy()
  expect(isSrc('name')).toBeFalsy()
  expect(isSrc('')).toBeFalsy()
  expect(isSrc('blob:http://img.cdn.com')).toBeTruthy()
  expect(isSrc('blob:https://img.cdn.com')).toBeTruthy()
  expect(isSrc('xdata:image/jpeg;base64,/9j/4AAQSkZ')).toBeFalsy()
})
