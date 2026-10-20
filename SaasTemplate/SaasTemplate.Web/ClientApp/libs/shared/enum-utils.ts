export interface IEnumOption<T = number> {
  value: T;
  label: string;
}

export function enumToOptions<T>(
  enumType: any,
  translatePrefix?: string,
  toUpperCase: boolean = true
): IEnumOption<T>[] {

  return Object.keys(enumType)
    .filter(key => isNaN(Number(key))) // ukloni reverse mapping
    .map(key => {

      let labelKey = toUpperCase ? key.toUpperCase() : key;

      if (translatePrefix) {
        labelKey = `${translatePrefix}.${labelKey}`;
      }

      return {
        value: enumType[key],
        label: labelKey
      };
    });
}
