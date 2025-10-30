export function debounce<T extends (...args: unknown[]) => Promise<unknown>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function debounceAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: number | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result as ReturnType<T>);
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
  };
}