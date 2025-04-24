/**
 * Go-like error catching utility.
 * https://gist.github.com/MCarlomagno/acd0906dbb982a9e6c9455ef45ca86b8
 * 
 * The 'attempt' function receives a callback function as a parameter
 * and calls it inside a try catch statement.
 * 
 * Returns a tuple of [data, error] where 'data' (if exists) is the 
 * result of the operation and 'error' (if exists)
 * is the error from the catch statement.
 */

type AttemptError = {
  msg: string;
  errorObject: any;
};

type AttemptState<T> = {
  result: T | undefined;
  error: AttemptError | undefined;
}

type AttemptResult<T> = [T | undefined, AttemptError | undefined];

export const attempt = async <T>(
  fn: () => Promise<T>
): Promise<AttemptResult<T>> => {

  let state: AttemptState<T> = {
    result: undefined,
    error: undefined,
  };

  try {
    state.result = await fn();
  } catch (err) {
    state.error = {
      msg: err instanceof Error ? err.message : 'An error has ocurred',
      errorObject: err
    };
  } finally {
    return [state.result, state.error];
  }
};
