// Utility to serialize Prisma objects containing BigInt and Decimal
export function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  if (typeof obj === 'object') {
    // If it's a Prisma Decimal (has a toNumber method and d/s decimal.js properties)
    if (obj.constructor?.name === 'Decimal' || (typeof obj.toNumber === 'function' && obj.d !== undefined)) {
      return obj.toNumber();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(serializeBigInt);
    }
    
    if (obj instanceof Date) {
      return obj.toISOString();
    }
    
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = serializeBigInt(obj[key]);
      }
    }
    return result;
  }
  return obj;
}
