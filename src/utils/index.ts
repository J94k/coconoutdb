export enum Log {
  error,
  warning,
}

const style = {
  [Log.error]: 'color: red;',
  [Log.warning]: 'color: yellow;  background-color: brown;',
}

export function log({ value, title, type }: { value: any; title: string; type?: Log }) {
  console.group(`%c ${title}`, style[type || ''] || 'color: gray;')

  if (type === Log.error) {
    console.error(value)
  } else if (type === Log.warning) {
    console.warn(value)
  } else {
    console.log(value)
  }

  console.groupEnd()
}
