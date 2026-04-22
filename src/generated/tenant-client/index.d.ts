
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model TenantUser
 * 
 */
export type TenantUser = $Result.DefaultSelection<Prisma.$TenantUserPayload>
/**
 * Model Patient
 * 
 */
export type Patient = $Result.DefaultSelection<Prisma.$PatientPayload>
/**
 * Model Appointment
 * 
 */
export type Appointment = $Result.DefaultSelection<Prisma.$AppointmentPayload>
/**
 * Model Department
 * 
 */
export type Department = $Result.DefaultSelection<Prisma.$DepartmentPayload>
/**
 * Model Staff
 * 
 */
export type Staff = $Result.DefaultSelection<Prisma.$StaffPayload>
/**
 * Model Bed
 * 
 */
export type Bed = $Result.DefaultSelection<Prisma.$BedPayload>
/**
 * Model TenantShiftTemplate
 * 
 */
export type TenantShiftTemplate = $Result.DefaultSelection<Prisma.$TenantShiftTemplatePayload>
/**
 * Model TenantShiftRoster
 * 
 */
export type TenantShiftRoster = $Result.DefaultSelection<Prisma.$TenantShiftRosterPayload>
/**
 * Model TenantAttendance
 * 
 */
export type TenantAttendance = $Result.DefaultSelection<Prisma.$TenantAttendancePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more TenantUsers
 * const tenantUsers = await prisma.tenantUser.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more TenantUsers
   * const tenantUsers = await prisma.tenantUser.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tenantUser`: Exposes CRUD operations for the **TenantUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantUsers
    * const tenantUsers = await prisma.tenantUser.findMany()
    * ```
    */
  get tenantUser(): Prisma.TenantUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointment.findMany()
    * ```
    */
  get appointment(): Prisma.AppointmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.department`: Exposes CRUD operations for the **Department** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Departments
    * const departments = await prisma.department.findMany()
    * ```
    */
  get department(): Prisma.DepartmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.staff`: Exposes CRUD operations for the **Staff** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Staff
    * const staff = await prisma.staff.findMany()
    * ```
    */
  get staff(): Prisma.StaffDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bed`: Exposes CRUD operations for the **Bed** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Beds
    * const beds = await prisma.bed.findMany()
    * ```
    */
  get bed(): Prisma.BedDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenantShiftTemplate`: Exposes CRUD operations for the **TenantShiftTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantShiftTemplates
    * const tenantShiftTemplates = await prisma.tenantShiftTemplate.findMany()
    * ```
    */
  get tenantShiftTemplate(): Prisma.TenantShiftTemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenantShiftRoster`: Exposes CRUD operations for the **TenantShiftRoster** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantShiftRosters
    * const tenantShiftRosters = await prisma.tenantShiftRoster.findMany()
    * ```
    */
  get tenantShiftRoster(): Prisma.TenantShiftRosterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenantAttendance`: Exposes CRUD operations for the **TenantAttendance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantAttendances
    * const tenantAttendances = await prisma.tenantAttendance.findMany()
    * ```
    */
  get tenantAttendance(): Prisma.TenantAttendanceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    TenantUser: 'TenantUser',
    Patient: 'Patient',
    Appointment: 'Appointment',
    Department: 'Department',
    Staff: 'Staff',
    Bed: 'Bed',
    TenantShiftTemplate: 'TenantShiftTemplate',
    TenantShiftRoster: 'TenantShiftRoster',
    TenantAttendance: 'TenantAttendance'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tenantUser" | "patient" | "appointment" | "department" | "staff" | "bed" | "tenantShiftTemplate" | "tenantShiftRoster" | "tenantAttendance"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      TenantUser: {
        payload: Prisma.$TenantUserPayload<ExtArgs>
        fields: Prisma.TenantUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          findFirst: {
            args: Prisma.TenantUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          findMany: {
            args: Prisma.TenantUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>[]
          }
          create: {
            args: Prisma.TenantUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          createMany: {
            args: Prisma.TenantUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>[]
          }
          delete: {
            args: Prisma.TenantUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          update: {
            args: Prisma.TenantUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          deleteMany: {
            args: Prisma.TenantUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>[]
          }
          upsert: {
            args: Prisma.TenantUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          aggregate: {
            args: Prisma.TenantUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantUser>
          }
          groupBy: {
            args: Prisma.TenantUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantUserCountArgs<ExtArgs>
            result: $Utils.Optional<TenantUserCountAggregateOutputType> | number
          }
        }
      }
      Patient: {
        payload: Prisma.$PatientPayload<ExtArgs>
        fields: Prisma.PatientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findFirst: {
            args: Prisma.PatientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findMany: {
            args: Prisma.PatientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          create: {
            args: Prisma.PatientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          createMany: {
            args: Prisma.PatientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          delete: {
            args: Prisma.PatientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          update: {
            args: Prisma.PatientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          deleteMany: {
            args: Prisma.PatientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PatientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          upsert: {
            args: Prisma.PatientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          aggregate: {
            args: Prisma.PatientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatient>
          }
          groupBy: {
            args: Prisma.PatientGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientCountArgs<ExtArgs>
            result: $Utils.Optional<PatientCountAggregateOutputType> | number
          }
        }
      }
      Appointment: {
        payload: Prisma.$AppointmentPayload<ExtArgs>
        fields: Prisma.AppointmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findFirst: {
            args: Prisma.AppointmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findMany: {
            args: Prisma.AppointmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          create: {
            args: Prisma.AppointmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          createMany: {
            args: Prisma.AppointmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          delete: {
            args: Prisma.AppointmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          update: {
            args: Prisma.AppointmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          deleteMany: {
            args: Prisma.AppointmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppointmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          upsert: {
            args: Prisma.AppointmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          aggregate: {
            args: Prisma.AppointmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointment>
          }
          groupBy: {
            args: Prisma.AppointmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentCountAggregateOutputType> | number
          }
        }
      }
      Department: {
        payload: Prisma.$DepartmentPayload<ExtArgs>
        fields: Prisma.DepartmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findFirst: {
            args: Prisma.DepartmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findMany: {
            args: Prisma.DepartmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          create: {
            args: Prisma.DepartmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          createMany: {
            args: Prisma.DepartmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepartmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          delete: {
            args: Prisma.DepartmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          update: {
            args: Prisma.DepartmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DepartmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          upsert: {
            args: Prisma.DepartmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          aggregate: {
            args: Prisma.DepartmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartment>
          }
          groupBy: {
            args: Prisma.DepartmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentCountAggregateOutputType> | number
          }
        }
      }
      Staff: {
        payload: Prisma.$StaffPayload<ExtArgs>
        fields: Prisma.StaffFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StaffFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StaffFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          findFirst: {
            args: Prisma.StaffFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StaffFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          findMany: {
            args: Prisma.StaffFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>[]
          }
          create: {
            args: Prisma.StaffCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          createMany: {
            args: Prisma.StaffCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StaffCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>[]
          }
          delete: {
            args: Prisma.StaffDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          update: {
            args: Prisma.StaffUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          deleteMany: {
            args: Prisma.StaffDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StaffUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StaffUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>[]
          }
          upsert: {
            args: Prisma.StaffUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          aggregate: {
            args: Prisma.StaffAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStaff>
          }
          groupBy: {
            args: Prisma.StaffGroupByArgs<ExtArgs>
            result: $Utils.Optional<StaffGroupByOutputType>[]
          }
          count: {
            args: Prisma.StaffCountArgs<ExtArgs>
            result: $Utils.Optional<StaffCountAggregateOutputType> | number
          }
        }
      }
      Bed: {
        payload: Prisma.$BedPayload<ExtArgs>
        fields: Prisma.BedFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BedFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BedFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload>
          }
          findFirst: {
            args: Prisma.BedFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BedFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload>
          }
          findMany: {
            args: Prisma.BedFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload>[]
          }
          create: {
            args: Prisma.BedCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload>
          }
          createMany: {
            args: Prisma.BedCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BedCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload>[]
          }
          delete: {
            args: Prisma.BedDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload>
          }
          update: {
            args: Prisma.BedUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload>
          }
          deleteMany: {
            args: Prisma.BedDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BedUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BedUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload>[]
          }
          upsert: {
            args: Prisma.BedUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BedPayload>
          }
          aggregate: {
            args: Prisma.BedAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBed>
          }
          groupBy: {
            args: Prisma.BedGroupByArgs<ExtArgs>
            result: $Utils.Optional<BedGroupByOutputType>[]
          }
          count: {
            args: Prisma.BedCountArgs<ExtArgs>
            result: $Utils.Optional<BedCountAggregateOutputType> | number
          }
        }
      }
      TenantShiftTemplate: {
        payload: Prisma.$TenantShiftTemplatePayload<ExtArgs>
        fields: Prisma.TenantShiftTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantShiftTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantShiftTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload>
          }
          findFirst: {
            args: Prisma.TenantShiftTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantShiftTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload>
          }
          findMany: {
            args: Prisma.TenantShiftTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload>[]
          }
          create: {
            args: Prisma.TenantShiftTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload>
          }
          createMany: {
            args: Prisma.TenantShiftTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantShiftTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload>[]
          }
          delete: {
            args: Prisma.TenantShiftTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload>
          }
          update: {
            args: Prisma.TenantShiftTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload>
          }
          deleteMany: {
            args: Prisma.TenantShiftTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantShiftTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantShiftTemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload>[]
          }
          upsert: {
            args: Prisma.TenantShiftTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftTemplatePayload>
          }
          aggregate: {
            args: Prisma.TenantShiftTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantShiftTemplate>
          }
          groupBy: {
            args: Prisma.TenantShiftTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantShiftTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantShiftTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<TenantShiftTemplateCountAggregateOutputType> | number
          }
        }
      }
      TenantShiftRoster: {
        payload: Prisma.$TenantShiftRosterPayload<ExtArgs>
        fields: Prisma.TenantShiftRosterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantShiftRosterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantShiftRosterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload>
          }
          findFirst: {
            args: Prisma.TenantShiftRosterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantShiftRosterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload>
          }
          findMany: {
            args: Prisma.TenantShiftRosterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload>[]
          }
          create: {
            args: Prisma.TenantShiftRosterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload>
          }
          createMany: {
            args: Prisma.TenantShiftRosterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantShiftRosterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload>[]
          }
          delete: {
            args: Prisma.TenantShiftRosterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload>
          }
          update: {
            args: Prisma.TenantShiftRosterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload>
          }
          deleteMany: {
            args: Prisma.TenantShiftRosterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantShiftRosterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantShiftRosterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload>[]
          }
          upsert: {
            args: Prisma.TenantShiftRosterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantShiftRosterPayload>
          }
          aggregate: {
            args: Prisma.TenantShiftRosterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantShiftRoster>
          }
          groupBy: {
            args: Prisma.TenantShiftRosterGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantShiftRosterGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantShiftRosterCountArgs<ExtArgs>
            result: $Utils.Optional<TenantShiftRosterCountAggregateOutputType> | number
          }
        }
      }
      TenantAttendance: {
        payload: Prisma.$TenantAttendancePayload<ExtArgs>
        fields: Prisma.TenantAttendanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantAttendanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantAttendanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload>
          }
          findFirst: {
            args: Prisma.TenantAttendanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantAttendanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload>
          }
          findMany: {
            args: Prisma.TenantAttendanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload>[]
          }
          create: {
            args: Prisma.TenantAttendanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload>
          }
          createMany: {
            args: Prisma.TenantAttendanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantAttendanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload>[]
          }
          delete: {
            args: Prisma.TenantAttendanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload>
          }
          update: {
            args: Prisma.TenantAttendanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload>
          }
          deleteMany: {
            args: Prisma.TenantAttendanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantAttendanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantAttendanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload>[]
          }
          upsert: {
            args: Prisma.TenantAttendanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAttendancePayload>
          }
          aggregate: {
            args: Prisma.TenantAttendanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantAttendance>
          }
          groupBy: {
            args: Prisma.TenantAttendanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantAttendanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantAttendanceCountArgs<ExtArgs>
            result: $Utils.Optional<TenantAttendanceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    tenantUser?: TenantUserOmit
    patient?: PatientOmit
    appointment?: AppointmentOmit
    department?: DepartmentOmit
    staff?: StaffOmit
    bed?: BedOmit
    tenantShiftTemplate?: TenantShiftTemplateOmit
    tenantShiftRoster?: TenantShiftRosterOmit
    tenantAttendance?: TenantAttendanceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PatientCountOutputType
   */

  export type PatientCountOutputType = {
    appointments: number
  }

  export type PatientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | PatientCountOutputTypeCountAppointmentsArgs
  }

  // Custom InputTypes
  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientCountOutputType
     */
    select?: PatientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }


  /**
   * Count Type DepartmentCountOutputType
   */

  export type DepartmentCountOutputType = {
    specialists: number
  }

  export type DepartmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    specialists?: boolean | DepartmentCountOutputTypeCountSpecialistsArgs
  }

  // Custom InputTypes
  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentCountOutputType
     */
    select?: DepartmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountSpecialistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StaffWhereInput
  }


  /**
   * Count Type TenantShiftTemplateCountOutputType
   */

  export type TenantShiftTemplateCountOutputType = {
    rosters: number
  }

  export type TenantShiftTemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rosters?: boolean | TenantShiftTemplateCountOutputTypeCountRostersArgs
  }

  // Custom InputTypes
  /**
   * TenantShiftTemplateCountOutputType without action
   */
  export type TenantShiftTemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplateCountOutputType
     */
    select?: TenantShiftTemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantShiftTemplateCountOutputType without action
   */
  export type TenantShiftTemplateCountOutputTypeCountRostersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantShiftRosterWhereInput
  }


  /**
   * Models
   */

  /**
   * Model TenantUser
   */

  export type AggregateTenantUser = {
    _count: TenantUserCountAggregateOutputType | null
    _min: TenantUserMinAggregateOutputType | null
    _max: TenantUserMaxAggregateOutputType | null
  }

  export type TenantUserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    role: string | null
    status: string | null
    isRestricted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantUserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    role: string | null
    status: string | null
    isRestricted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantUserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    role: number
    consoleRoles: number
    status: number
    isRestricted: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantUserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    role?: true
    status?: true
    isRestricted?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantUserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    role?: true
    status?: true
    isRestricted?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantUserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    role?: true
    consoleRoles?: true
    status?: true
    isRestricted?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUser to aggregate.
     */
    where?: TenantUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsers to fetch.
     */
    orderBy?: TenantUserOrderByWithRelationInput | TenantUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantUsers
    **/
    _count?: true | TenantUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantUserMaxAggregateInputType
  }

  export type GetTenantUserAggregateType<T extends TenantUserAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantUser[P]>
      : GetScalarType<T[P], AggregateTenantUser[P]>
  }




  export type TenantUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantUserWhereInput
    orderBy?: TenantUserOrderByWithAggregationInput | TenantUserOrderByWithAggregationInput[]
    by: TenantUserScalarFieldEnum[] | TenantUserScalarFieldEnum
    having?: TenantUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantUserCountAggregateInputType | true
    _min?: TenantUserMinAggregateInputType
    _max?: TenantUserMaxAggregateInputType
  }

  export type TenantUserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    password: string
    role: string
    consoleRoles: JsonValue | null
    status: string
    isRestricted: boolean
    createdAt: Date
    updatedAt: Date
    _count: TenantUserCountAggregateOutputType | null
    _min: TenantUserMinAggregateOutputType | null
    _max: TenantUserMaxAggregateOutputType | null
  }

  type GetTenantUserGroupByPayload<T extends TenantUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantUserGroupByOutputType[P]>
            : GetScalarType<T[P], TenantUserGroupByOutputType[P]>
        }
      >
    >


  export type TenantUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    consoleRoles?: boolean
    status?: boolean
    isRestricted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenantUser"]>

  export type TenantUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    consoleRoles?: boolean
    status?: boolean
    isRestricted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenantUser"]>

  export type TenantUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    consoleRoles?: boolean
    status?: boolean
    isRestricted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenantUser"]>

  export type TenantUserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    role?: boolean
    consoleRoles?: boolean
    status?: boolean
    isRestricted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password" | "role" | "consoleRoles" | "status" | "isRestricted" | "createdAt" | "updatedAt", ExtArgs["result"]["tenantUser"]>

  export type $TenantUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      password: string
      role: string
      consoleRoles: Prisma.JsonValue | null
      status: string
      isRestricted: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenantUser"]>
    composites: {}
  }

  type TenantUserGetPayload<S extends boolean | null | undefined | TenantUserDefaultArgs> = $Result.GetResult<Prisma.$TenantUserPayload, S>

  type TenantUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantUserCountAggregateInputType | true
    }

  export interface TenantUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantUser'], meta: { name: 'TenantUser' } }
    /**
     * Find zero or one TenantUser that matches the filter.
     * @param {TenantUserFindUniqueArgs} args - Arguments to find a TenantUser
     * @example
     * // Get one TenantUser
     * const tenantUser = await prisma.tenantUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantUserFindUniqueArgs>(args: SelectSubset<T, TenantUserFindUniqueArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantUserFindUniqueOrThrowArgs} args - Arguments to find a TenantUser
     * @example
     * // Get one TenantUser
     * const tenantUser = await prisma.tenantUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantUserFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserFindFirstArgs} args - Arguments to find a TenantUser
     * @example
     * // Get one TenantUser
     * const tenantUser = await prisma.tenantUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantUserFindFirstArgs>(args?: SelectSubset<T, TenantUserFindFirstArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserFindFirstOrThrowArgs} args - Arguments to find a TenantUser
     * @example
     * // Get one TenantUser
     * const tenantUser = await prisma.tenantUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantUserFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantUsers
     * const tenantUsers = await prisma.tenantUser.findMany()
     * 
     * // Get first 10 TenantUsers
     * const tenantUsers = await prisma.tenantUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantUserWithIdOnly = await prisma.tenantUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantUserFindManyArgs>(args?: SelectSubset<T, TenantUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantUser.
     * @param {TenantUserCreateArgs} args - Arguments to create a TenantUser.
     * @example
     * // Create one TenantUser
     * const TenantUser = await prisma.tenantUser.create({
     *   data: {
     *     // ... data to create a TenantUser
     *   }
     * })
     * 
     */
    create<T extends TenantUserCreateArgs>(args: SelectSubset<T, TenantUserCreateArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantUsers.
     * @param {TenantUserCreateManyArgs} args - Arguments to create many TenantUsers.
     * @example
     * // Create many TenantUsers
     * const tenantUser = await prisma.tenantUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantUserCreateManyArgs>(args?: SelectSubset<T, TenantUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantUsers and returns the data saved in the database.
     * @param {TenantUserCreateManyAndReturnArgs} args - Arguments to create many TenantUsers.
     * @example
     * // Create many TenantUsers
     * const tenantUser = await prisma.tenantUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantUsers and only return the `id`
     * const tenantUserWithIdOnly = await prisma.tenantUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantUserCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TenantUser.
     * @param {TenantUserDeleteArgs} args - Arguments to delete one TenantUser.
     * @example
     * // Delete one TenantUser
     * const TenantUser = await prisma.tenantUser.delete({
     *   where: {
     *     // ... filter to delete one TenantUser
     *   }
     * })
     * 
     */
    delete<T extends TenantUserDeleteArgs>(args: SelectSubset<T, TenantUserDeleteArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantUser.
     * @param {TenantUserUpdateArgs} args - Arguments to update one TenantUser.
     * @example
     * // Update one TenantUser
     * const tenantUser = await prisma.tenantUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUserUpdateArgs>(args: SelectSubset<T, TenantUserUpdateArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantUsers.
     * @param {TenantUserDeleteManyArgs} args - Arguments to filter TenantUsers to delete.
     * @example
     * // Delete a few TenantUsers
     * const { count } = await prisma.tenantUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantUserDeleteManyArgs>(args?: SelectSubset<T, TenantUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantUsers
     * const tenantUser = await prisma.tenantUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUserUpdateManyArgs>(args: SelectSubset<T, TenantUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantUsers and returns the data updated in the database.
     * @param {TenantUserUpdateManyAndReturnArgs} args - Arguments to update many TenantUsers.
     * @example
     * // Update many TenantUsers
     * const tenantUser = await prisma.tenantUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TenantUsers and only return the `id`
     * const tenantUserWithIdOnly = await prisma.tenantUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUserUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TenantUser.
     * @param {TenantUserUpsertArgs} args - Arguments to update or create a TenantUser.
     * @example
     * // Update or create a TenantUser
     * const tenantUser = await prisma.tenantUser.upsert({
     *   create: {
     *     // ... data to create a TenantUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantUser we want to update
     *   }
     * })
     */
    upsert<T extends TenantUserUpsertArgs>(args: SelectSubset<T, TenantUserUpsertArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserCountArgs} args - Arguments to filter TenantUsers to count.
     * @example
     * // Count the number of TenantUsers
     * const count = await prisma.tenantUser.count({
     *   where: {
     *     // ... the filter for the TenantUsers we want to count
     *   }
     * })
    **/
    count<T extends TenantUserCountArgs>(
      args?: Subset<T, TenantUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantUserAggregateArgs>(args: Subset<T, TenantUserAggregateArgs>): Prisma.PrismaPromise<GetTenantUserAggregateType<T>>

    /**
     * Group by TenantUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantUserGroupByArgs['orderBy'] }
        : { orderBy?: TenantUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantUser model
   */
  readonly fields: TenantUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantUser model
   */
  interface TenantUserFieldRefs {
    readonly id: FieldRef<"TenantUser", 'String'>
    readonly email: FieldRef<"TenantUser", 'String'>
    readonly name: FieldRef<"TenantUser", 'String'>
    readonly password: FieldRef<"TenantUser", 'String'>
    readonly role: FieldRef<"TenantUser", 'String'>
    readonly consoleRoles: FieldRef<"TenantUser", 'Json'>
    readonly status: FieldRef<"TenantUser", 'String'>
    readonly isRestricted: FieldRef<"TenantUser", 'Boolean'>
    readonly createdAt: FieldRef<"TenantUser", 'DateTime'>
    readonly updatedAt: FieldRef<"TenantUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantUser findUnique
   */
  export type TenantUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Filter, which TenantUser to fetch.
     */
    where: TenantUserWhereUniqueInput
  }

  /**
   * TenantUser findUniqueOrThrow
   */
  export type TenantUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Filter, which TenantUser to fetch.
     */
    where: TenantUserWhereUniqueInput
  }

  /**
   * TenantUser findFirst
   */
  export type TenantUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Filter, which TenantUser to fetch.
     */
    where?: TenantUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsers to fetch.
     */
    orderBy?: TenantUserOrderByWithRelationInput | TenantUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUsers.
     */
    cursor?: TenantUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUsers.
     */
    distinct?: TenantUserScalarFieldEnum | TenantUserScalarFieldEnum[]
  }

  /**
   * TenantUser findFirstOrThrow
   */
  export type TenantUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Filter, which TenantUser to fetch.
     */
    where?: TenantUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsers to fetch.
     */
    orderBy?: TenantUserOrderByWithRelationInput | TenantUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUsers.
     */
    cursor?: TenantUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUsers.
     */
    distinct?: TenantUserScalarFieldEnum | TenantUserScalarFieldEnum[]
  }

  /**
   * TenantUser findMany
   */
  export type TenantUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Filter, which TenantUsers to fetch.
     */
    where?: TenantUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsers to fetch.
     */
    orderBy?: TenantUserOrderByWithRelationInput | TenantUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantUsers.
     */
    cursor?: TenantUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUsers.
     */
    distinct?: TenantUserScalarFieldEnum | TenantUserScalarFieldEnum[]
  }

  /**
   * TenantUser create
   */
  export type TenantUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * The data needed to create a TenantUser.
     */
    data: XOR<TenantUserCreateInput, TenantUserUncheckedCreateInput>
  }

  /**
   * TenantUser createMany
   */
  export type TenantUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantUsers.
     */
    data: TenantUserCreateManyInput | TenantUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantUser createManyAndReturn
   */
  export type TenantUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * The data used to create many TenantUsers.
     */
    data: TenantUserCreateManyInput | TenantUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantUser update
   */
  export type TenantUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * The data needed to update a TenantUser.
     */
    data: XOR<TenantUserUpdateInput, TenantUserUncheckedUpdateInput>
    /**
     * Choose, which TenantUser to update.
     */
    where: TenantUserWhereUniqueInput
  }

  /**
   * TenantUser updateMany
   */
  export type TenantUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantUsers.
     */
    data: XOR<TenantUserUpdateManyMutationInput, TenantUserUncheckedUpdateManyInput>
    /**
     * Filter which TenantUsers to update
     */
    where?: TenantUserWhereInput
    /**
     * Limit how many TenantUsers to update.
     */
    limit?: number
  }

  /**
   * TenantUser updateManyAndReturn
   */
  export type TenantUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * The data used to update TenantUsers.
     */
    data: XOR<TenantUserUpdateManyMutationInput, TenantUserUncheckedUpdateManyInput>
    /**
     * Filter which TenantUsers to update
     */
    where?: TenantUserWhereInput
    /**
     * Limit how many TenantUsers to update.
     */
    limit?: number
  }

  /**
   * TenantUser upsert
   */
  export type TenantUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * The filter to search for the TenantUser to update in case it exists.
     */
    where: TenantUserWhereUniqueInput
    /**
     * In case the TenantUser found by the `where` argument doesn't exist, create a new TenantUser with this data.
     */
    create: XOR<TenantUserCreateInput, TenantUserUncheckedCreateInput>
    /**
     * In case the TenantUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUserUpdateInput, TenantUserUncheckedUpdateInput>
  }

  /**
   * TenantUser delete
   */
  export type TenantUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Filter which TenantUser to delete.
     */
    where: TenantUserWhereUniqueInput
  }

  /**
   * TenantUser deleteMany
   */
  export type TenantUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUsers to delete
     */
    where?: TenantUserWhereInput
    /**
     * Limit how many TenantUsers to delete.
     */
    limit?: number
  }

  /**
   * TenantUser without action
   */
  export type TenantUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
  }


  /**
   * Model Patient
   */

  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientMinAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    dateOfBirth: Date | null
    gender: string | null
    bloodGroup: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientMaxAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    dateOfBirth: Date | null
    gender: string | null
    bloodGroup: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    firstName: number
    lastName: number
    email: number
    phone: number
    dateOfBirth: number
    gender: number
    bloodGroup: number
    address: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientMinAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    dateOfBirth?: true
    gender?: true
    bloodGroup?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    dateOfBirth?: true
    gender?: true
    bloodGroup?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    dateOfBirth?: true
    gender?: true
    bloodGroup?: true
    address?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patient to aggregate.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithAggregationInput | PatientOrderByWithAggregationInput[]
    by: PatientScalarFieldEnum[] | PatientScalarFieldEnum
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }

  export type PatientGroupByOutputType = {
    id: string
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    dateOfBirth: Date | null
    gender: string | null
    bloodGroup: string | null
    address: string | null
    createdAt: Date
    updatedAt: Date
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    bloodGroup?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointments?: boolean | Patient$appointmentsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    bloodGroup?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    bloodGroup?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectScalar = {
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    bloodGroup?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firstName" | "lastName" | "email" | "phone" | "dateOfBirth" | "gender" | "bloodGroup" | "address" | "createdAt" | "updatedAt", ExtArgs["result"]["patient"]>
  export type PatientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | Patient$appointmentsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PatientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PatientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PatientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Patient"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firstName: string
      lastName: string
      email: string | null
      phone: string | null
      dateOfBirth: Date | null
      gender: string | null
      bloodGroup: string | null
      address: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patient"]>
    composites: {}
  }

  type PatientGetPayload<S extends boolean | null | undefined | PatientDefaultArgs> = $Result.GetResult<Prisma.$PatientPayload, S>

  type PatientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PatientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PatientCountAggregateInputType | true
    }

  export interface PatientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Patient'], meta: { name: 'Patient' } }
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientFindUniqueArgs>(args: SelectSubset<T, PatientFindUniqueArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Patient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientFindFirstArgs>(args?: SelectSubset<T, PatientFindFirstArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientFindManyArgs>(args?: SelectSubset<T, PatientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
     */
    create<T extends PatientCreateArgs>(args: SelectSubset<T, PatientCreateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Patients.
     * @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientCreateManyArgs>(args?: SelectSubset<T, PatientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Patients and returns the data saved in the database.
     * @param {PatientCreateManyAndReturnArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
     */
    delete<T extends PatientDeleteArgs>(args: SelectSubset<T, PatientDeleteArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientUpdateArgs>(args: SelectSubset<T, PatientUpdateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDeleteManyArgs>(args?: SelectSubset<T, PatientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientUpdateManyArgs>(args: SelectSubset<T, PatientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients and returns the data updated in the database.
     * @param {PatientUpdateManyAndReturnArgs} args - Arguments to update many Patients.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PatientUpdateManyAndReturnArgs>(args: SelectSubset<T, PatientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
     */
    upsert<T extends PatientUpsertArgs>(args: SelectSubset<T, PatientUpsertArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): Prisma.PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Patient model
   */
  readonly fields: PatientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends Patient$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Patient model
   */
  interface PatientFieldRefs {
    readonly id: FieldRef<"Patient", 'String'>
    readonly firstName: FieldRef<"Patient", 'String'>
    readonly lastName: FieldRef<"Patient", 'String'>
    readonly email: FieldRef<"Patient", 'String'>
    readonly phone: FieldRef<"Patient", 'String'>
    readonly dateOfBirth: FieldRef<"Patient", 'DateTime'>
    readonly gender: FieldRef<"Patient", 'String'>
    readonly bloodGroup: FieldRef<"Patient", 'String'>
    readonly address: FieldRef<"Patient", 'String'>
    readonly createdAt: FieldRef<"Patient", 'DateTime'>
    readonly updatedAt: FieldRef<"Patient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Patient findUnique
   */
  export type PatientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findFirst
   */
  export type PatientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patients to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient create
   */
  export type PatientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to create a Patient.
     */
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }

  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient createManyAndReturn
   */
  export type PatientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient update
   */
  export type PatientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to update a Patient.
     */
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient updateManyAndReturn
   */
  export type PatientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient upsert
   */
  export type PatientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The filter to search for the Patient to update in case it exists.
     */
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     */
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }

  /**
   * Patient delete
   */
  export type PatientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter which Patient to delete.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patients to delete
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to delete.
     */
    limit?: number
  }

  /**
   * Patient.appointments
   */
  export type Patient$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Patient without action
   */
  export type PatientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
  }


  /**
   * Model Appointment
   */

  export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  export type AppointmentMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    dateTime: Date | null
    status: string | null
    reason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    dateTime: Date | null
    status: string | null
    reason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentCountAggregateOutputType = {
    id: number
    patientId: number
    dateTime: number
    status: number
    reason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AppointmentMinAggregateInputType = {
    id?: true
    patientId?: true
    dateTime?: true
    status?: true
    reason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentMaxAggregateInputType = {
    id?: true
    patientId?: true
    dateTime?: true
    status?: true
    reason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentCountAggregateInputType = {
    id?: true
    patientId?: true
    dateTime?: true
    status?: true
    reason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AppointmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointment to aggregate.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appointments
    **/
    _count?: true | AppointmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentMaxAggregateInputType
  }

  export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointment[P]>
      : GetScalarType<T[P], AggregateAppointment[P]>
  }




  export type AppointmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithAggregationInput | AppointmentOrderByWithAggregationInput[]
    by: AppointmentScalarFieldEnum[] | AppointmentScalarFieldEnum
    having?: AppointmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentCountAggregateInputType | true
    _min?: AppointmentMinAggregateInputType
    _max?: AppointmentMaxAggregateInputType
  }

  export type AppointmentGroupByOutputType = {
    id: string
    patientId: string
    dateTime: Date
    status: string
    reason: string | null
    createdAt: Date
    updatedAt: Date
    _count: AppointmentCountAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    dateTime?: boolean
    status?: boolean
    reason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    dateTime?: boolean
    status?: boolean
    reason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    dateTime?: boolean
    status?: boolean
    reason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectScalar = {
    id?: boolean
    patientId?: boolean
    dateTime?: boolean
    status?: boolean
    reason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AppointmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "dateTime" | "status" | "reason" | "createdAt" | "updatedAt", ExtArgs["result"]["appointment"]>
  export type AppointmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type AppointmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $AppointmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appointment"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      dateTime: Date
      status: string
      reason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["appointment"]>
    composites: {}
  }

  type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = $Result.GetResult<Prisma.$AppointmentPayload, S>

  type AppointmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppointmentCountAggregateInputType | true
    }

  export interface AppointmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appointment'], meta: { name: 'Appointment' } }
    /**
     * Find zero or one Appointment that matches the filter.
     * @param {AppointmentFindUniqueArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentFindUniqueArgs>(args: SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Appointment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppointmentFindUniqueOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentFindFirstArgs>(args?: SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointment.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentWithIdOnly = await prisma.appointment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentFindManyArgs>(args?: SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Appointment.
     * @param {AppointmentCreateArgs} args - Arguments to create a Appointment.
     * @example
     * // Create one Appointment
     * const Appointment = await prisma.appointment.create({
     *   data: {
     *     // ... data to create a Appointment
     *   }
     * })
     * 
     */
    create<T extends AppointmentCreateArgs>(args: SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Appointments.
     * @param {AppointmentCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentCreateManyArgs>(args?: SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {AppointmentCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Appointment.
     * @param {AppointmentDeleteArgs} args - Arguments to delete one Appointment.
     * @example
     * // Delete one Appointment
     * const Appointment = await prisma.appointment.delete({
     *   where: {
     *     // ... filter to delete one Appointment
     *   }
     * })
     * 
     */
    delete<T extends AppointmentDeleteArgs>(args: SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Appointment.
     * @param {AppointmentUpdateArgs} args - Arguments to update one Appointment.
     * @example
     * // Update one Appointment
     * const appointment = await prisma.appointment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentUpdateArgs>(args: SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Appointments.
     * @param {AppointmentDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentUpdateManyArgs>(args: SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments and returns the data updated in the database.
     * @param {AppointmentUpdateManyAndReturnArgs} args - Arguments to update many Appointments.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppointmentUpdateManyAndReturnArgs>(args: SelectSubset<T, AppointmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Appointment.
     * @param {AppointmentUpsertArgs} args - Arguments to update or create a Appointment.
     * @example
     * // Update or create a Appointment
     * const appointment = await prisma.appointment.upsert({
     *   create: {
     *     // ... data to create a Appointment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointment we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentUpsertArgs>(args: SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointment.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends AppointmentCountArgs>(
      args?: Subset<T, AppointmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppointmentAggregateArgs>(args: Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>

    /**
     * Group by Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppointmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appointment model
   */
  readonly fields: AppointmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appointment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Appointment model
   */
  interface AppointmentFieldRefs {
    readonly id: FieldRef<"Appointment", 'String'>
    readonly patientId: FieldRef<"Appointment", 'String'>
    readonly dateTime: FieldRef<"Appointment", 'DateTime'>
    readonly status: FieldRef<"Appointment", 'String'>
    readonly reason: FieldRef<"Appointment", 'String'>
    readonly createdAt: FieldRef<"Appointment", 'DateTime'>
    readonly updatedAt: FieldRef<"Appointment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Appointment findUnique
   */
  export type AppointmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findUniqueOrThrow
   */
  export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findFirst
   */
  export type AppointmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findFirstOrThrow
   */
  export type AppointmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findMany
   */
  export type AppointmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointments to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment create
   */
  export type AppointmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Appointment.
     */
    data: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
  }

  /**
   * Appointment createMany
   */
  export type AppointmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment createManyAndReturn
   */
  export type AppointmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment update
   */
  export type AppointmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Appointment.
     */
    data: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
    /**
     * Choose, which Appointment to update.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment updateMany
   */
  export type AppointmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
  }

  /**
   * Appointment updateManyAndReturn
   */
  export type AppointmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment upsert
   */
  export type AppointmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Appointment to update in case it exists.
     */
    where: AppointmentWhereUniqueInput
    /**
     * In case the Appointment found by the `where` argument doesn't exist, create a new Appointment with this data.
     */
    create: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
    /**
     * In case the Appointment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
  }

  /**
   * Appointment delete
   */
  export type AppointmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter which Appointment to delete.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment deleteMany
   */
  export type AppointmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointments to delete
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to delete.
     */
    limit?: number
  }

  /**
   * Appointment without action
   */
  export type AppointmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
  }


  /**
   * Model Department
   */

  export type AggregateDepartment = {
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  export type DepartmentMinAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    description: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentMaxAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    description: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentCountAggregateOutputType = {
    id: number
    name: number
    code: number
    description: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DepartmentMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    description?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    description?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    description?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DepartmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Department to aggregate.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Departments
    **/
    _count?: true | DepartmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentMaxAggregateInputType
  }

  export type GetDepartmentAggregateType<T extends DepartmentAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartment[P]>
      : GetScalarType<T[P], AggregateDepartment[P]>
  }




  export type DepartmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithAggregationInput | DepartmentOrderByWithAggregationInput[]
    by: DepartmentScalarFieldEnum[] | DepartmentScalarFieldEnum
    having?: DepartmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentCountAggregateInputType | true
    _min?: DepartmentMinAggregateInputType
    _max?: DepartmentMaxAggregateInputType
  }

  export type DepartmentGroupByOutputType = {
    id: string
    name: string
    code: string
    description: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  type GetDepartmentGroupByPayload<T extends DepartmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    specialists?: boolean | Department$specialistsArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DepartmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "code" | "description" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["department"]>
  export type DepartmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    specialists?: boolean | Department$specialistsArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DepartmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DepartmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DepartmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Department"
    objects: {
      specialists: Prisma.$StaffPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      code: string
      description: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["department"]>
    composites: {}
  }

  type DepartmentGetPayload<S extends boolean | null | undefined | DepartmentDefaultArgs> = $Result.GetResult<Prisma.$DepartmentPayload, S>

  type DepartmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentCountAggregateInputType | true
    }

  export interface DepartmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Department'], meta: { name: 'Department' } }
    /**
     * Find zero or one Department that matches the filter.
     * @param {DepartmentFindUniqueArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentFindUniqueArgs>(args: SelectSubset<T, DepartmentFindUniqueArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Department that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentFindUniqueOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentFindFirstArgs>(args?: SelectSubset<T, DepartmentFindFirstArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Departments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Departments
     * const departments = await prisma.department.findMany()
     * 
     * // Get first 10 Departments
     * const departments = await prisma.department.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentWithIdOnly = await prisma.department.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentFindManyArgs>(args?: SelectSubset<T, DepartmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Department.
     * @param {DepartmentCreateArgs} args - Arguments to create a Department.
     * @example
     * // Create one Department
     * const Department = await prisma.department.create({
     *   data: {
     *     // ... data to create a Department
     *   }
     * })
     * 
     */
    create<T extends DepartmentCreateArgs>(args: SelectSubset<T, DepartmentCreateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Departments.
     * @param {DepartmentCreateManyArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentCreateManyArgs>(args?: SelectSubset<T, DepartmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Departments and returns the data saved in the database.
     * @param {DepartmentCreateManyAndReturnArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Departments and only return the `id`
     * const departmentWithIdOnly = await prisma.department.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepartmentCreateManyAndReturnArgs>(args?: SelectSubset<T, DepartmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Department.
     * @param {DepartmentDeleteArgs} args - Arguments to delete one Department.
     * @example
     * // Delete one Department
     * const Department = await prisma.department.delete({
     *   where: {
     *     // ... filter to delete one Department
     *   }
     * })
     * 
     */
    delete<T extends DepartmentDeleteArgs>(args: SelectSubset<T, DepartmentDeleteArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Department.
     * @param {DepartmentUpdateArgs} args - Arguments to update one Department.
     * @example
     * // Update one Department
     * const department = await prisma.department.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentUpdateArgs>(args: SelectSubset<T, DepartmentUpdateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Departments.
     * @param {DepartmentDeleteManyArgs} args - Arguments to filter Departments to delete.
     * @example
     * // Delete a few Departments
     * const { count } = await prisma.department.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentDeleteManyArgs>(args?: SelectSubset<T, DepartmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentUpdateManyArgs>(args: SelectSubset<T, DepartmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments and returns the data updated in the database.
     * @param {DepartmentUpdateManyAndReturnArgs} args - Arguments to update many Departments.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Departments and only return the `id`
     * const departmentWithIdOnly = await prisma.department.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DepartmentUpdateManyAndReturnArgs>(args: SelectSubset<T, DepartmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Department.
     * @param {DepartmentUpsertArgs} args - Arguments to update or create a Department.
     * @example
     * // Update or create a Department
     * const department = await prisma.department.upsert({
     *   create: {
     *     // ... data to create a Department
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Department we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentUpsertArgs>(args: SelectSubset<T, DepartmentUpsertArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentCountArgs} args - Arguments to filter Departments to count.
     * @example
     * // Count the number of Departments
     * const count = await prisma.department.count({
     *   where: {
     *     // ... the filter for the Departments we want to count
     *   }
     * })
    **/
    count<T extends DepartmentCountArgs>(
      args?: Subset<T, DepartmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentAggregateArgs>(args: Subset<T, DepartmentAggregateArgs>): Prisma.PrismaPromise<GetDepartmentAggregateType<T>>

    /**
     * Group by Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Department model
   */
  readonly fields: DepartmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Department.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    specialists<T extends Department$specialistsArgs<ExtArgs> = {}>(args?: Subset<T, Department$specialistsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Department model
   */
  interface DepartmentFieldRefs {
    readonly id: FieldRef<"Department", 'String'>
    readonly name: FieldRef<"Department", 'String'>
    readonly code: FieldRef<"Department", 'String'>
    readonly description: FieldRef<"Department", 'String'>
    readonly active: FieldRef<"Department", 'Boolean'>
    readonly createdAt: FieldRef<"Department", 'DateTime'>
    readonly updatedAt: FieldRef<"Department", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Department findUnique
   */
  export type DepartmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findUniqueOrThrow
   */
  export type DepartmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findFirst
   */
  export type DepartmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findFirstOrThrow
   */
  export type DepartmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findMany
   */
  export type DepartmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Departments to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department create
   */
  export type DepartmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Department.
     */
    data: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
  }

  /**
   * Department createMany
   */
  export type DepartmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Department createManyAndReturn
   */
  export type DepartmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Department update
   */
  export type DepartmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Department.
     */
    data: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
    /**
     * Choose, which Department to update.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department updateMany
   */
  export type DepartmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department updateManyAndReturn
   */
  export type DepartmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department upsert
   */
  export type DepartmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Department to update in case it exists.
     */
    where: DepartmentWhereUniqueInput
    /**
     * In case the Department found by the `where` argument doesn't exist, create a new Department with this data.
     */
    create: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
    /**
     * In case the Department was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
  }

  /**
   * Department delete
   */
  export type DepartmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter which Department to delete.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department deleteMany
   */
  export type DepartmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Departments to delete
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to delete.
     */
    limit?: number
  }

  /**
   * Department.specialists
   */
  export type Department$specialistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    where?: StaffWhereInput
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    cursor?: StaffWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * Department without action
   */
  export type DepartmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
  }


  /**
   * Model Staff
   */

  export type AggregateStaff = {
    _count: StaffCountAggregateOutputType | null
    _min: StaffMinAggregateOutputType | null
    _max: StaffMaxAggregateOutputType | null
  }

  export type StaffMinAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    designation: string | null
    specialization: string | null
    departmentId: string | null
    email: string | null
    phone: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StaffMaxAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    designation: string | null
    specialization: string | null
    departmentId: string | null
    email: string | null
    phone: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StaffCountAggregateOutputType = {
    id: number
    firstName: number
    lastName: number
    designation: number
    specialization: number
    departmentId: number
    email: number
    phone: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StaffMinAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    designation?: true
    specialization?: true
    departmentId?: true
    email?: true
    phone?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StaffMaxAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    designation?: true
    specialization?: true
    departmentId?: true
    email?: true
    phone?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StaffCountAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    designation?: true
    specialization?: true
    departmentId?: true
    email?: true
    phone?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StaffAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Staff to aggregate.
     */
    where?: StaffWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Staff to fetch.
     */
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StaffWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Staff from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Staff.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Staff
    **/
    _count?: true | StaffCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StaffMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StaffMaxAggregateInputType
  }

  export type GetStaffAggregateType<T extends StaffAggregateArgs> = {
        [P in keyof T & keyof AggregateStaff]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStaff[P]>
      : GetScalarType<T[P], AggregateStaff[P]>
  }




  export type StaffGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StaffWhereInput
    orderBy?: StaffOrderByWithAggregationInput | StaffOrderByWithAggregationInput[]
    by: StaffScalarFieldEnum[] | StaffScalarFieldEnum
    having?: StaffScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StaffCountAggregateInputType | true
    _min?: StaffMinAggregateInputType
    _max?: StaffMaxAggregateInputType
  }

  export type StaffGroupByOutputType = {
    id: string
    firstName: string
    lastName: string
    designation: string
    specialization: string | null
    departmentId: string | null
    email: string
    phone: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: StaffCountAggregateOutputType | null
    _min: StaffMinAggregateOutputType | null
    _max: StaffMaxAggregateOutputType | null
  }

  type GetStaffGroupByPayload<T extends StaffGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StaffGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StaffGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StaffGroupByOutputType[P]>
            : GetScalarType<T[P], StaffGroupByOutputType[P]>
        }
      >
    >


  export type StaffSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    designation?: boolean
    specialization?: boolean
    departmentId?: boolean
    email?: boolean
    phone?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    department?: boolean | Staff$departmentArgs<ExtArgs>
  }, ExtArgs["result"]["staff"]>

  export type StaffSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    designation?: boolean
    specialization?: boolean
    departmentId?: boolean
    email?: boolean
    phone?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    department?: boolean | Staff$departmentArgs<ExtArgs>
  }, ExtArgs["result"]["staff"]>

  export type StaffSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    designation?: boolean
    specialization?: boolean
    departmentId?: boolean
    email?: boolean
    phone?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    department?: boolean | Staff$departmentArgs<ExtArgs>
  }, ExtArgs["result"]["staff"]>

  export type StaffSelectScalar = {
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    designation?: boolean
    specialization?: boolean
    departmentId?: boolean
    email?: boolean
    phone?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StaffOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firstName" | "lastName" | "designation" | "specialization" | "departmentId" | "email" | "phone" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["staff"]>
  export type StaffInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | Staff$departmentArgs<ExtArgs>
  }
  export type StaffIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | Staff$departmentArgs<ExtArgs>
  }
  export type StaffIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | Staff$departmentArgs<ExtArgs>
  }

  export type $StaffPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Staff"
    objects: {
      department: Prisma.$DepartmentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firstName: string
      lastName: string
      designation: string
      specialization: string | null
      departmentId: string | null
      email: string
      phone: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["staff"]>
    composites: {}
  }

  type StaffGetPayload<S extends boolean | null | undefined | StaffDefaultArgs> = $Result.GetResult<Prisma.$StaffPayload, S>

  type StaffCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StaffFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StaffCountAggregateInputType | true
    }

  export interface StaffDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Staff'], meta: { name: 'Staff' } }
    /**
     * Find zero or one Staff that matches the filter.
     * @param {StaffFindUniqueArgs} args - Arguments to find a Staff
     * @example
     * // Get one Staff
     * const staff = await prisma.staff.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StaffFindUniqueArgs>(args: SelectSubset<T, StaffFindUniqueArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Staff that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StaffFindUniqueOrThrowArgs} args - Arguments to find a Staff
     * @example
     * // Get one Staff
     * const staff = await prisma.staff.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StaffFindUniqueOrThrowArgs>(args: SelectSubset<T, StaffFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Staff that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffFindFirstArgs} args - Arguments to find a Staff
     * @example
     * // Get one Staff
     * const staff = await prisma.staff.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StaffFindFirstArgs>(args?: SelectSubset<T, StaffFindFirstArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Staff that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffFindFirstOrThrowArgs} args - Arguments to find a Staff
     * @example
     * // Get one Staff
     * const staff = await prisma.staff.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StaffFindFirstOrThrowArgs>(args?: SelectSubset<T, StaffFindFirstOrThrowArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Staff that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Staff
     * const staff = await prisma.staff.findMany()
     * 
     * // Get first 10 Staff
     * const staff = await prisma.staff.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const staffWithIdOnly = await prisma.staff.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StaffFindManyArgs>(args?: SelectSubset<T, StaffFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Staff.
     * @param {StaffCreateArgs} args - Arguments to create a Staff.
     * @example
     * // Create one Staff
     * const Staff = await prisma.staff.create({
     *   data: {
     *     // ... data to create a Staff
     *   }
     * })
     * 
     */
    create<T extends StaffCreateArgs>(args: SelectSubset<T, StaffCreateArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Staff.
     * @param {StaffCreateManyArgs} args - Arguments to create many Staff.
     * @example
     * // Create many Staff
     * const staff = await prisma.staff.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StaffCreateManyArgs>(args?: SelectSubset<T, StaffCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Staff and returns the data saved in the database.
     * @param {StaffCreateManyAndReturnArgs} args - Arguments to create many Staff.
     * @example
     * // Create many Staff
     * const staff = await prisma.staff.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Staff and only return the `id`
     * const staffWithIdOnly = await prisma.staff.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StaffCreateManyAndReturnArgs>(args?: SelectSubset<T, StaffCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Staff.
     * @param {StaffDeleteArgs} args - Arguments to delete one Staff.
     * @example
     * // Delete one Staff
     * const Staff = await prisma.staff.delete({
     *   where: {
     *     // ... filter to delete one Staff
     *   }
     * })
     * 
     */
    delete<T extends StaffDeleteArgs>(args: SelectSubset<T, StaffDeleteArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Staff.
     * @param {StaffUpdateArgs} args - Arguments to update one Staff.
     * @example
     * // Update one Staff
     * const staff = await prisma.staff.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StaffUpdateArgs>(args: SelectSubset<T, StaffUpdateArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Staff.
     * @param {StaffDeleteManyArgs} args - Arguments to filter Staff to delete.
     * @example
     * // Delete a few Staff
     * const { count } = await prisma.staff.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StaffDeleteManyArgs>(args?: SelectSubset<T, StaffDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Staff.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Staff
     * const staff = await prisma.staff.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StaffUpdateManyArgs>(args: SelectSubset<T, StaffUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Staff and returns the data updated in the database.
     * @param {StaffUpdateManyAndReturnArgs} args - Arguments to update many Staff.
     * @example
     * // Update many Staff
     * const staff = await prisma.staff.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Staff and only return the `id`
     * const staffWithIdOnly = await prisma.staff.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StaffUpdateManyAndReturnArgs>(args: SelectSubset<T, StaffUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Staff.
     * @param {StaffUpsertArgs} args - Arguments to update or create a Staff.
     * @example
     * // Update or create a Staff
     * const staff = await prisma.staff.upsert({
     *   create: {
     *     // ... data to create a Staff
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Staff we want to update
     *   }
     * })
     */
    upsert<T extends StaffUpsertArgs>(args: SelectSubset<T, StaffUpsertArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Staff.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffCountArgs} args - Arguments to filter Staff to count.
     * @example
     * // Count the number of Staff
     * const count = await prisma.staff.count({
     *   where: {
     *     // ... the filter for the Staff we want to count
     *   }
     * })
    **/
    count<T extends StaffCountArgs>(
      args?: Subset<T, StaffCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StaffCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Staff.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StaffAggregateArgs>(args: Subset<T, StaffAggregateArgs>): Prisma.PrismaPromise<GetStaffAggregateType<T>>

    /**
     * Group by Staff.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StaffGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StaffGroupByArgs['orderBy'] }
        : { orderBy?: StaffGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StaffGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStaffGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Staff model
   */
  readonly fields: StaffFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Staff.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StaffClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    department<T extends Staff$departmentArgs<ExtArgs> = {}>(args?: Subset<T, Staff$departmentArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Staff model
   */
  interface StaffFieldRefs {
    readonly id: FieldRef<"Staff", 'String'>
    readonly firstName: FieldRef<"Staff", 'String'>
    readonly lastName: FieldRef<"Staff", 'String'>
    readonly designation: FieldRef<"Staff", 'String'>
    readonly specialization: FieldRef<"Staff", 'String'>
    readonly departmentId: FieldRef<"Staff", 'String'>
    readonly email: FieldRef<"Staff", 'String'>
    readonly phone: FieldRef<"Staff", 'String'>
    readonly active: FieldRef<"Staff", 'Boolean'>
    readonly createdAt: FieldRef<"Staff", 'DateTime'>
    readonly updatedAt: FieldRef<"Staff", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Staff findUnique
   */
  export type StaffFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where: StaffWhereUniqueInput
  }

  /**
   * Staff findUniqueOrThrow
   */
  export type StaffFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where: StaffWhereUniqueInput
  }

  /**
   * Staff findFirst
   */
  export type StaffFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where?: StaffWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Staff to fetch.
     */
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Staff.
     */
    cursor?: StaffWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Staff from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Staff.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Staff.
     */
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * Staff findFirstOrThrow
   */
  export type StaffFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where?: StaffWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Staff to fetch.
     */
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Staff.
     */
    cursor?: StaffWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Staff from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Staff.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Staff.
     */
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * Staff findMany
   */
  export type StaffFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where?: StaffWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Staff to fetch.
     */
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Staff.
     */
    cursor?: StaffWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Staff from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Staff.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Staff.
     */
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * Staff create
   */
  export type StaffCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * The data needed to create a Staff.
     */
    data: XOR<StaffCreateInput, StaffUncheckedCreateInput>
  }

  /**
   * Staff createMany
   */
  export type StaffCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Staff.
     */
    data: StaffCreateManyInput | StaffCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Staff createManyAndReturn
   */
  export type StaffCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * The data used to create many Staff.
     */
    data: StaffCreateManyInput | StaffCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Staff update
   */
  export type StaffUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * The data needed to update a Staff.
     */
    data: XOR<StaffUpdateInput, StaffUncheckedUpdateInput>
    /**
     * Choose, which Staff to update.
     */
    where: StaffWhereUniqueInput
  }

  /**
   * Staff updateMany
   */
  export type StaffUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Staff.
     */
    data: XOR<StaffUpdateManyMutationInput, StaffUncheckedUpdateManyInput>
    /**
     * Filter which Staff to update
     */
    where?: StaffWhereInput
    /**
     * Limit how many Staff to update.
     */
    limit?: number
  }

  /**
   * Staff updateManyAndReturn
   */
  export type StaffUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * The data used to update Staff.
     */
    data: XOR<StaffUpdateManyMutationInput, StaffUncheckedUpdateManyInput>
    /**
     * Filter which Staff to update
     */
    where?: StaffWhereInput
    /**
     * Limit how many Staff to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Staff upsert
   */
  export type StaffUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * The filter to search for the Staff to update in case it exists.
     */
    where: StaffWhereUniqueInput
    /**
     * In case the Staff found by the `where` argument doesn't exist, create a new Staff with this data.
     */
    create: XOR<StaffCreateInput, StaffUncheckedCreateInput>
    /**
     * In case the Staff was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StaffUpdateInput, StaffUncheckedUpdateInput>
  }

  /**
   * Staff delete
   */
  export type StaffDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter which Staff to delete.
     */
    where: StaffWhereUniqueInput
  }

  /**
   * Staff deleteMany
   */
  export type StaffDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Staff to delete
     */
    where?: StaffWhereInput
    /**
     * Limit how many Staff to delete.
     */
    limit?: number
  }

  /**
   * Staff.department
   */
  export type Staff$departmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    where?: DepartmentWhereInput
  }

  /**
   * Staff without action
   */
  export type StaffDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Staff
     */
    omit?: StaffOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
  }


  /**
   * Model Bed
   */

  export type AggregateBed = {
    _count: BedCountAggregateOutputType | null
    _min: BedMinAggregateOutputType | null
    _max: BedMaxAggregateOutputType | null
  }

  export type BedMinAggregateOutputType = {
    id: string | null
    bedNumber: string | null
    wardName: string | null
    type: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BedMaxAggregateOutputType = {
    id: string | null
    bedNumber: string | null
    wardName: string | null
    type: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BedCountAggregateOutputType = {
    id: number
    bedNumber: number
    wardName: number
    type: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BedMinAggregateInputType = {
    id?: true
    bedNumber?: true
    wardName?: true
    type?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BedMaxAggregateInputType = {
    id?: true
    bedNumber?: true
    wardName?: true
    type?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BedCountAggregateInputType = {
    id?: true
    bedNumber?: true
    wardName?: true
    type?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BedAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bed to aggregate.
     */
    where?: BedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Beds to fetch.
     */
    orderBy?: BedOrderByWithRelationInput | BedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Beds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Beds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Beds
    **/
    _count?: true | BedCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BedMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BedMaxAggregateInputType
  }

  export type GetBedAggregateType<T extends BedAggregateArgs> = {
        [P in keyof T & keyof AggregateBed]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBed[P]>
      : GetScalarType<T[P], AggregateBed[P]>
  }




  export type BedGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BedWhereInput
    orderBy?: BedOrderByWithAggregationInput | BedOrderByWithAggregationInput[]
    by: BedScalarFieldEnum[] | BedScalarFieldEnum
    having?: BedScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BedCountAggregateInputType | true
    _min?: BedMinAggregateInputType
    _max?: BedMaxAggregateInputType
  }

  export type BedGroupByOutputType = {
    id: string
    bedNumber: string
    wardName: string
    type: string
    status: string
    createdAt: Date
    updatedAt: Date
    _count: BedCountAggregateOutputType | null
    _min: BedMinAggregateOutputType | null
    _max: BedMaxAggregateOutputType | null
  }

  type GetBedGroupByPayload<T extends BedGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BedGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BedGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BedGroupByOutputType[P]>
            : GetScalarType<T[P], BedGroupByOutputType[P]>
        }
      >
    >


  export type BedSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bedNumber?: boolean
    wardName?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["bed"]>

  export type BedSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bedNumber?: boolean
    wardName?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["bed"]>

  export type BedSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bedNumber?: boolean
    wardName?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["bed"]>

  export type BedSelectScalar = {
    id?: boolean
    bedNumber?: boolean
    wardName?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BedOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bedNumber" | "wardName" | "type" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["bed"]>

  export type $BedPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bed"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bedNumber: string
      wardName: string
      type: string
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["bed"]>
    composites: {}
  }

  type BedGetPayload<S extends boolean | null | undefined | BedDefaultArgs> = $Result.GetResult<Prisma.$BedPayload, S>

  type BedCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BedFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BedCountAggregateInputType | true
    }

  export interface BedDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bed'], meta: { name: 'Bed' } }
    /**
     * Find zero or one Bed that matches the filter.
     * @param {BedFindUniqueArgs} args - Arguments to find a Bed
     * @example
     * // Get one Bed
     * const bed = await prisma.bed.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BedFindUniqueArgs>(args: SelectSubset<T, BedFindUniqueArgs<ExtArgs>>): Prisma__BedClient<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bed that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BedFindUniqueOrThrowArgs} args - Arguments to find a Bed
     * @example
     * // Get one Bed
     * const bed = await prisma.bed.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BedFindUniqueOrThrowArgs>(args: SelectSubset<T, BedFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BedClient<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bed that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BedFindFirstArgs} args - Arguments to find a Bed
     * @example
     * // Get one Bed
     * const bed = await prisma.bed.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BedFindFirstArgs>(args?: SelectSubset<T, BedFindFirstArgs<ExtArgs>>): Prisma__BedClient<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bed that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BedFindFirstOrThrowArgs} args - Arguments to find a Bed
     * @example
     * // Get one Bed
     * const bed = await prisma.bed.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BedFindFirstOrThrowArgs>(args?: SelectSubset<T, BedFindFirstOrThrowArgs<ExtArgs>>): Prisma__BedClient<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Beds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BedFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Beds
     * const beds = await prisma.bed.findMany()
     * 
     * // Get first 10 Beds
     * const beds = await prisma.bed.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bedWithIdOnly = await prisma.bed.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BedFindManyArgs>(args?: SelectSubset<T, BedFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bed.
     * @param {BedCreateArgs} args - Arguments to create a Bed.
     * @example
     * // Create one Bed
     * const Bed = await prisma.bed.create({
     *   data: {
     *     // ... data to create a Bed
     *   }
     * })
     * 
     */
    create<T extends BedCreateArgs>(args: SelectSubset<T, BedCreateArgs<ExtArgs>>): Prisma__BedClient<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Beds.
     * @param {BedCreateManyArgs} args - Arguments to create many Beds.
     * @example
     * // Create many Beds
     * const bed = await prisma.bed.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BedCreateManyArgs>(args?: SelectSubset<T, BedCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Beds and returns the data saved in the database.
     * @param {BedCreateManyAndReturnArgs} args - Arguments to create many Beds.
     * @example
     * // Create many Beds
     * const bed = await prisma.bed.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Beds and only return the `id`
     * const bedWithIdOnly = await prisma.bed.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BedCreateManyAndReturnArgs>(args?: SelectSubset<T, BedCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bed.
     * @param {BedDeleteArgs} args - Arguments to delete one Bed.
     * @example
     * // Delete one Bed
     * const Bed = await prisma.bed.delete({
     *   where: {
     *     // ... filter to delete one Bed
     *   }
     * })
     * 
     */
    delete<T extends BedDeleteArgs>(args: SelectSubset<T, BedDeleteArgs<ExtArgs>>): Prisma__BedClient<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bed.
     * @param {BedUpdateArgs} args - Arguments to update one Bed.
     * @example
     * // Update one Bed
     * const bed = await prisma.bed.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BedUpdateArgs>(args: SelectSubset<T, BedUpdateArgs<ExtArgs>>): Prisma__BedClient<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Beds.
     * @param {BedDeleteManyArgs} args - Arguments to filter Beds to delete.
     * @example
     * // Delete a few Beds
     * const { count } = await prisma.bed.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BedDeleteManyArgs>(args?: SelectSubset<T, BedDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Beds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BedUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Beds
     * const bed = await prisma.bed.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BedUpdateManyArgs>(args: SelectSubset<T, BedUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Beds and returns the data updated in the database.
     * @param {BedUpdateManyAndReturnArgs} args - Arguments to update many Beds.
     * @example
     * // Update many Beds
     * const bed = await prisma.bed.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Beds and only return the `id`
     * const bedWithIdOnly = await prisma.bed.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BedUpdateManyAndReturnArgs>(args: SelectSubset<T, BedUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bed.
     * @param {BedUpsertArgs} args - Arguments to update or create a Bed.
     * @example
     * // Update or create a Bed
     * const bed = await prisma.bed.upsert({
     *   create: {
     *     // ... data to create a Bed
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bed we want to update
     *   }
     * })
     */
    upsert<T extends BedUpsertArgs>(args: SelectSubset<T, BedUpsertArgs<ExtArgs>>): Prisma__BedClient<$Result.GetResult<Prisma.$BedPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Beds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BedCountArgs} args - Arguments to filter Beds to count.
     * @example
     * // Count the number of Beds
     * const count = await prisma.bed.count({
     *   where: {
     *     // ... the filter for the Beds we want to count
     *   }
     * })
    **/
    count<T extends BedCountArgs>(
      args?: Subset<T, BedCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BedCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bed.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BedAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BedAggregateArgs>(args: Subset<T, BedAggregateArgs>): Prisma.PrismaPromise<GetBedAggregateType<T>>

    /**
     * Group by Bed.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BedGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BedGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BedGroupByArgs['orderBy'] }
        : { orderBy?: BedGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BedGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBedGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bed model
   */
  readonly fields: BedFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bed.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BedClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bed model
   */
  interface BedFieldRefs {
    readonly id: FieldRef<"Bed", 'String'>
    readonly bedNumber: FieldRef<"Bed", 'String'>
    readonly wardName: FieldRef<"Bed", 'String'>
    readonly type: FieldRef<"Bed", 'String'>
    readonly status: FieldRef<"Bed", 'String'>
    readonly createdAt: FieldRef<"Bed", 'DateTime'>
    readonly updatedAt: FieldRef<"Bed", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bed findUnique
   */
  export type BedFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * Filter, which Bed to fetch.
     */
    where: BedWhereUniqueInput
  }

  /**
   * Bed findUniqueOrThrow
   */
  export type BedFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * Filter, which Bed to fetch.
     */
    where: BedWhereUniqueInput
  }

  /**
   * Bed findFirst
   */
  export type BedFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * Filter, which Bed to fetch.
     */
    where?: BedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Beds to fetch.
     */
    orderBy?: BedOrderByWithRelationInput | BedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Beds.
     */
    cursor?: BedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Beds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Beds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Beds.
     */
    distinct?: BedScalarFieldEnum | BedScalarFieldEnum[]
  }

  /**
   * Bed findFirstOrThrow
   */
  export type BedFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * Filter, which Bed to fetch.
     */
    where?: BedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Beds to fetch.
     */
    orderBy?: BedOrderByWithRelationInput | BedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Beds.
     */
    cursor?: BedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Beds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Beds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Beds.
     */
    distinct?: BedScalarFieldEnum | BedScalarFieldEnum[]
  }

  /**
   * Bed findMany
   */
  export type BedFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * Filter, which Beds to fetch.
     */
    where?: BedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Beds to fetch.
     */
    orderBy?: BedOrderByWithRelationInput | BedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Beds.
     */
    cursor?: BedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Beds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Beds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Beds.
     */
    distinct?: BedScalarFieldEnum | BedScalarFieldEnum[]
  }

  /**
   * Bed create
   */
  export type BedCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * The data needed to create a Bed.
     */
    data: XOR<BedCreateInput, BedUncheckedCreateInput>
  }

  /**
   * Bed createMany
   */
  export type BedCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Beds.
     */
    data: BedCreateManyInput | BedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bed createManyAndReturn
   */
  export type BedCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * The data used to create many Beds.
     */
    data: BedCreateManyInput | BedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bed update
   */
  export type BedUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * The data needed to update a Bed.
     */
    data: XOR<BedUpdateInput, BedUncheckedUpdateInput>
    /**
     * Choose, which Bed to update.
     */
    where: BedWhereUniqueInput
  }

  /**
   * Bed updateMany
   */
  export type BedUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Beds.
     */
    data: XOR<BedUpdateManyMutationInput, BedUncheckedUpdateManyInput>
    /**
     * Filter which Beds to update
     */
    where?: BedWhereInput
    /**
     * Limit how many Beds to update.
     */
    limit?: number
  }

  /**
   * Bed updateManyAndReturn
   */
  export type BedUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * The data used to update Beds.
     */
    data: XOR<BedUpdateManyMutationInput, BedUncheckedUpdateManyInput>
    /**
     * Filter which Beds to update
     */
    where?: BedWhereInput
    /**
     * Limit how many Beds to update.
     */
    limit?: number
  }

  /**
   * Bed upsert
   */
  export type BedUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * The filter to search for the Bed to update in case it exists.
     */
    where: BedWhereUniqueInput
    /**
     * In case the Bed found by the `where` argument doesn't exist, create a new Bed with this data.
     */
    create: XOR<BedCreateInput, BedUncheckedCreateInput>
    /**
     * In case the Bed was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BedUpdateInput, BedUncheckedUpdateInput>
  }

  /**
   * Bed delete
   */
  export type BedDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
    /**
     * Filter which Bed to delete.
     */
    where: BedWhereUniqueInput
  }

  /**
   * Bed deleteMany
   */
  export type BedDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Beds to delete
     */
    where?: BedWhereInput
    /**
     * Limit how many Beds to delete.
     */
    limit?: number
  }

  /**
   * Bed without action
   */
  export type BedDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bed
     */
    select?: BedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bed
     */
    omit?: BedOmit<ExtArgs> | null
  }


  /**
   * Model TenantShiftTemplate
   */

  export type AggregateTenantShiftTemplate = {
    _count: TenantShiftTemplateCountAggregateOutputType | null
    _min: TenantShiftTemplateMinAggregateOutputType | null
    _max: TenantShiftTemplateMaxAggregateOutputType | null
  }

  export type TenantShiftTemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    department: string | null
    type: string | null
    startTime: string | null
    endTime: string | null
    breakDuration: string | null
    rule: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantShiftTemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    department: string | null
    type: string | null
    startTime: string | null
    endTime: string | null
    breakDuration: string | null
    rule: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantShiftTemplateCountAggregateOutputType = {
    id: number
    name: number
    department: number
    type: number
    startTime: number
    endTime: number
    breakDuration: number
    rule: number
    staffing: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantShiftTemplateMinAggregateInputType = {
    id?: true
    name?: true
    department?: true
    type?: true
    startTime?: true
    endTime?: true
    breakDuration?: true
    rule?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantShiftTemplateMaxAggregateInputType = {
    id?: true
    name?: true
    department?: true
    type?: true
    startTime?: true
    endTime?: true
    breakDuration?: true
    rule?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantShiftTemplateCountAggregateInputType = {
    id?: true
    name?: true
    department?: true
    type?: true
    startTime?: true
    endTime?: true
    breakDuration?: true
    rule?: true
    staffing?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantShiftTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantShiftTemplate to aggregate.
     */
    where?: TenantShiftTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantShiftTemplates to fetch.
     */
    orderBy?: TenantShiftTemplateOrderByWithRelationInput | TenantShiftTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantShiftTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantShiftTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantShiftTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantShiftTemplates
    **/
    _count?: true | TenantShiftTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantShiftTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantShiftTemplateMaxAggregateInputType
  }

  export type GetTenantShiftTemplateAggregateType<T extends TenantShiftTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantShiftTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantShiftTemplate[P]>
      : GetScalarType<T[P], AggregateTenantShiftTemplate[P]>
  }




  export type TenantShiftTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantShiftTemplateWhereInput
    orderBy?: TenantShiftTemplateOrderByWithAggregationInput | TenantShiftTemplateOrderByWithAggregationInput[]
    by: TenantShiftTemplateScalarFieldEnum[] | TenantShiftTemplateScalarFieldEnum
    having?: TenantShiftTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantShiftTemplateCountAggregateInputType | true
    _min?: TenantShiftTemplateMinAggregateInputType
    _max?: TenantShiftTemplateMaxAggregateInputType
  }

  export type TenantShiftTemplateGroupByOutputType = {
    id: string
    name: string
    department: string
    type: string
    startTime: string
    endTime: string
    breakDuration: string
    rule: string
    staffing: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: TenantShiftTemplateCountAggregateOutputType | null
    _min: TenantShiftTemplateMinAggregateOutputType | null
    _max: TenantShiftTemplateMaxAggregateOutputType | null
  }

  type GetTenantShiftTemplateGroupByPayload<T extends TenantShiftTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantShiftTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantShiftTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantShiftTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], TenantShiftTemplateGroupByOutputType[P]>
        }
      >
    >


  export type TenantShiftTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    department?: boolean
    type?: boolean
    startTime?: boolean
    endTime?: boolean
    breakDuration?: boolean
    rule?: boolean
    staffing?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rosters?: boolean | TenantShiftTemplate$rostersArgs<ExtArgs>
    _count?: boolean | TenantShiftTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantShiftTemplate"]>

  export type TenantShiftTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    department?: boolean
    type?: boolean
    startTime?: boolean
    endTime?: boolean
    breakDuration?: boolean
    rule?: boolean
    staffing?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenantShiftTemplate"]>

  export type TenantShiftTemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    department?: boolean
    type?: boolean
    startTime?: boolean
    endTime?: boolean
    breakDuration?: boolean
    rule?: boolean
    staffing?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tenantShiftTemplate"]>

  export type TenantShiftTemplateSelectScalar = {
    id?: boolean
    name?: boolean
    department?: boolean
    type?: boolean
    startTime?: boolean
    endTime?: boolean
    breakDuration?: boolean
    rule?: boolean
    staffing?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantShiftTemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "department" | "type" | "startTime" | "endTime" | "breakDuration" | "rule" | "staffing" | "createdAt" | "updatedAt", ExtArgs["result"]["tenantShiftTemplate"]>
  export type TenantShiftTemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rosters?: boolean | TenantShiftTemplate$rostersArgs<ExtArgs>
    _count?: boolean | TenantShiftTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantShiftTemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantShiftTemplateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantShiftTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantShiftTemplate"
    objects: {
      rosters: Prisma.$TenantShiftRosterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      department: string
      type: string
      startTime: string
      endTime: string
      breakDuration: string
      rule: string
      staffing: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenantShiftTemplate"]>
    composites: {}
  }

  type TenantShiftTemplateGetPayload<S extends boolean | null | undefined | TenantShiftTemplateDefaultArgs> = $Result.GetResult<Prisma.$TenantShiftTemplatePayload, S>

  type TenantShiftTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantShiftTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantShiftTemplateCountAggregateInputType | true
    }

  export interface TenantShiftTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantShiftTemplate'], meta: { name: 'TenantShiftTemplate' } }
    /**
     * Find zero or one TenantShiftTemplate that matches the filter.
     * @param {TenantShiftTemplateFindUniqueArgs} args - Arguments to find a TenantShiftTemplate
     * @example
     * // Get one TenantShiftTemplate
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantShiftTemplateFindUniqueArgs>(args: SelectSubset<T, TenantShiftTemplateFindUniqueArgs<ExtArgs>>): Prisma__TenantShiftTemplateClient<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantShiftTemplate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantShiftTemplateFindUniqueOrThrowArgs} args - Arguments to find a TenantShiftTemplate
     * @example
     * // Get one TenantShiftTemplate
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantShiftTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantShiftTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantShiftTemplateClient<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantShiftTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftTemplateFindFirstArgs} args - Arguments to find a TenantShiftTemplate
     * @example
     * // Get one TenantShiftTemplate
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantShiftTemplateFindFirstArgs>(args?: SelectSubset<T, TenantShiftTemplateFindFirstArgs<ExtArgs>>): Prisma__TenantShiftTemplateClient<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantShiftTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftTemplateFindFirstOrThrowArgs} args - Arguments to find a TenantShiftTemplate
     * @example
     * // Get one TenantShiftTemplate
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantShiftTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantShiftTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantShiftTemplateClient<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantShiftTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantShiftTemplates
     * const tenantShiftTemplates = await prisma.tenantShiftTemplate.findMany()
     * 
     * // Get first 10 TenantShiftTemplates
     * const tenantShiftTemplates = await prisma.tenantShiftTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantShiftTemplateWithIdOnly = await prisma.tenantShiftTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantShiftTemplateFindManyArgs>(args?: SelectSubset<T, TenantShiftTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantShiftTemplate.
     * @param {TenantShiftTemplateCreateArgs} args - Arguments to create a TenantShiftTemplate.
     * @example
     * // Create one TenantShiftTemplate
     * const TenantShiftTemplate = await prisma.tenantShiftTemplate.create({
     *   data: {
     *     // ... data to create a TenantShiftTemplate
     *   }
     * })
     * 
     */
    create<T extends TenantShiftTemplateCreateArgs>(args: SelectSubset<T, TenantShiftTemplateCreateArgs<ExtArgs>>): Prisma__TenantShiftTemplateClient<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantShiftTemplates.
     * @param {TenantShiftTemplateCreateManyArgs} args - Arguments to create many TenantShiftTemplates.
     * @example
     * // Create many TenantShiftTemplates
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantShiftTemplateCreateManyArgs>(args?: SelectSubset<T, TenantShiftTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantShiftTemplates and returns the data saved in the database.
     * @param {TenantShiftTemplateCreateManyAndReturnArgs} args - Arguments to create many TenantShiftTemplates.
     * @example
     * // Create many TenantShiftTemplates
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantShiftTemplates and only return the `id`
     * const tenantShiftTemplateWithIdOnly = await prisma.tenantShiftTemplate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantShiftTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantShiftTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TenantShiftTemplate.
     * @param {TenantShiftTemplateDeleteArgs} args - Arguments to delete one TenantShiftTemplate.
     * @example
     * // Delete one TenantShiftTemplate
     * const TenantShiftTemplate = await prisma.tenantShiftTemplate.delete({
     *   where: {
     *     // ... filter to delete one TenantShiftTemplate
     *   }
     * })
     * 
     */
    delete<T extends TenantShiftTemplateDeleteArgs>(args: SelectSubset<T, TenantShiftTemplateDeleteArgs<ExtArgs>>): Prisma__TenantShiftTemplateClient<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantShiftTemplate.
     * @param {TenantShiftTemplateUpdateArgs} args - Arguments to update one TenantShiftTemplate.
     * @example
     * // Update one TenantShiftTemplate
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantShiftTemplateUpdateArgs>(args: SelectSubset<T, TenantShiftTemplateUpdateArgs<ExtArgs>>): Prisma__TenantShiftTemplateClient<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantShiftTemplates.
     * @param {TenantShiftTemplateDeleteManyArgs} args - Arguments to filter TenantShiftTemplates to delete.
     * @example
     * // Delete a few TenantShiftTemplates
     * const { count } = await prisma.tenantShiftTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantShiftTemplateDeleteManyArgs>(args?: SelectSubset<T, TenantShiftTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantShiftTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantShiftTemplates
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantShiftTemplateUpdateManyArgs>(args: SelectSubset<T, TenantShiftTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantShiftTemplates and returns the data updated in the database.
     * @param {TenantShiftTemplateUpdateManyAndReturnArgs} args - Arguments to update many TenantShiftTemplates.
     * @example
     * // Update many TenantShiftTemplates
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TenantShiftTemplates and only return the `id`
     * const tenantShiftTemplateWithIdOnly = await prisma.tenantShiftTemplate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantShiftTemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantShiftTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TenantShiftTemplate.
     * @param {TenantShiftTemplateUpsertArgs} args - Arguments to update or create a TenantShiftTemplate.
     * @example
     * // Update or create a TenantShiftTemplate
     * const tenantShiftTemplate = await prisma.tenantShiftTemplate.upsert({
     *   create: {
     *     // ... data to create a TenantShiftTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantShiftTemplate we want to update
     *   }
     * })
     */
    upsert<T extends TenantShiftTemplateUpsertArgs>(args: SelectSubset<T, TenantShiftTemplateUpsertArgs<ExtArgs>>): Prisma__TenantShiftTemplateClient<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantShiftTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftTemplateCountArgs} args - Arguments to filter TenantShiftTemplates to count.
     * @example
     * // Count the number of TenantShiftTemplates
     * const count = await prisma.tenantShiftTemplate.count({
     *   where: {
     *     // ... the filter for the TenantShiftTemplates we want to count
     *   }
     * })
    **/
    count<T extends TenantShiftTemplateCountArgs>(
      args?: Subset<T, TenantShiftTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantShiftTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantShiftTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantShiftTemplateAggregateArgs>(args: Subset<T, TenantShiftTemplateAggregateArgs>): Prisma.PrismaPromise<GetTenantShiftTemplateAggregateType<T>>

    /**
     * Group by TenantShiftTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftTemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantShiftTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantShiftTemplateGroupByArgs['orderBy'] }
        : { orderBy?: TenantShiftTemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantShiftTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantShiftTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantShiftTemplate model
   */
  readonly fields: TenantShiftTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantShiftTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantShiftTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rosters<T extends TenantShiftTemplate$rostersArgs<ExtArgs> = {}>(args?: Subset<T, TenantShiftTemplate$rostersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantShiftTemplate model
   */
  interface TenantShiftTemplateFieldRefs {
    readonly id: FieldRef<"TenantShiftTemplate", 'String'>
    readonly name: FieldRef<"TenantShiftTemplate", 'String'>
    readonly department: FieldRef<"TenantShiftTemplate", 'String'>
    readonly type: FieldRef<"TenantShiftTemplate", 'String'>
    readonly startTime: FieldRef<"TenantShiftTemplate", 'String'>
    readonly endTime: FieldRef<"TenantShiftTemplate", 'String'>
    readonly breakDuration: FieldRef<"TenantShiftTemplate", 'String'>
    readonly rule: FieldRef<"TenantShiftTemplate", 'String'>
    readonly staffing: FieldRef<"TenantShiftTemplate", 'Json'>
    readonly createdAt: FieldRef<"TenantShiftTemplate", 'DateTime'>
    readonly updatedAt: FieldRef<"TenantShiftTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantShiftTemplate findUnique
   */
  export type TenantShiftTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftTemplate to fetch.
     */
    where: TenantShiftTemplateWhereUniqueInput
  }

  /**
   * TenantShiftTemplate findUniqueOrThrow
   */
  export type TenantShiftTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftTemplate to fetch.
     */
    where: TenantShiftTemplateWhereUniqueInput
  }

  /**
   * TenantShiftTemplate findFirst
   */
  export type TenantShiftTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftTemplate to fetch.
     */
    where?: TenantShiftTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantShiftTemplates to fetch.
     */
    orderBy?: TenantShiftTemplateOrderByWithRelationInput | TenantShiftTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantShiftTemplates.
     */
    cursor?: TenantShiftTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantShiftTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantShiftTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantShiftTemplates.
     */
    distinct?: TenantShiftTemplateScalarFieldEnum | TenantShiftTemplateScalarFieldEnum[]
  }

  /**
   * TenantShiftTemplate findFirstOrThrow
   */
  export type TenantShiftTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftTemplate to fetch.
     */
    where?: TenantShiftTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantShiftTemplates to fetch.
     */
    orderBy?: TenantShiftTemplateOrderByWithRelationInput | TenantShiftTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantShiftTemplates.
     */
    cursor?: TenantShiftTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantShiftTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantShiftTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantShiftTemplates.
     */
    distinct?: TenantShiftTemplateScalarFieldEnum | TenantShiftTemplateScalarFieldEnum[]
  }

  /**
   * TenantShiftTemplate findMany
   */
  export type TenantShiftTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftTemplates to fetch.
     */
    where?: TenantShiftTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantShiftTemplates to fetch.
     */
    orderBy?: TenantShiftTemplateOrderByWithRelationInput | TenantShiftTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantShiftTemplates.
     */
    cursor?: TenantShiftTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantShiftTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantShiftTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantShiftTemplates.
     */
    distinct?: TenantShiftTemplateScalarFieldEnum | TenantShiftTemplateScalarFieldEnum[]
  }

  /**
   * TenantShiftTemplate create
   */
  export type TenantShiftTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantShiftTemplate.
     */
    data: XOR<TenantShiftTemplateCreateInput, TenantShiftTemplateUncheckedCreateInput>
  }

  /**
   * TenantShiftTemplate createMany
   */
  export type TenantShiftTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantShiftTemplates.
     */
    data: TenantShiftTemplateCreateManyInput | TenantShiftTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantShiftTemplate createManyAndReturn
   */
  export type TenantShiftTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * The data used to create many TenantShiftTemplates.
     */
    data: TenantShiftTemplateCreateManyInput | TenantShiftTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantShiftTemplate update
   */
  export type TenantShiftTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantShiftTemplate.
     */
    data: XOR<TenantShiftTemplateUpdateInput, TenantShiftTemplateUncheckedUpdateInput>
    /**
     * Choose, which TenantShiftTemplate to update.
     */
    where: TenantShiftTemplateWhereUniqueInput
  }

  /**
   * TenantShiftTemplate updateMany
   */
  export type TenantShiftTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantShiftTemplates.
     */
    data: XOR<TenantShiftTemplateUpdateManyMutationInput, TenantShiftTemplateUncheckedUpdateManyInput>
    /**
     * Filter which TenantShiftTemplates to update
     */
    where?: TenantShiftTemplateWhereInput
    /**
     * Limit how many TenantShiftTemplates to update.
     */
    limit?: number
  }

  /**
   * TenantShiftTemplate updateManyAndReturn
   */
  export type TenantShiftTemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * The data used to update TenantShiftTemplates.
     */
    data: XOR<TenantShiftTemplateUpdateManyMutationInput, TenantShiftTemplateUncheckedUpdateManyInput>
    /**
     * Filter which TenantShiftTemplates to update
     */
    where?: TenantShiftTemplateWhereInput
    /**
     * Limit how many TenantShiftTemplates to update.
     */
    limit?: number
  }

  /**
   * TenantShiftTemplate upsert
   */
  export type TenantShiftTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantShiftTemplate to update in case it exists.
     */
    where: TenantShiftTemplateWhereUniqueInput
    /**
     * In case the TenantShiftTemplate found by the `where` argument doesn't exist, create a new TenantShiftTemplate with this data.
     */
    create: XOR<TenantShiftTemplateCreateInput, TenantShiftTemplateUncheckedCreateInput>
    /**
     * In case the TenantShiftTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantShiftTemplateUpdateInput, TenantShiftTemplateUncheckedUpdateInput>
  }

  /**
   * TenantShiftTemplate delete
   */
  export type TenantShiftTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    /**
     * Filter which TenantShiftTemplate to delete.
     */
    where: TenantShiftTemplateWhereUniqueInput
  }

  /**
   * TenantShiftTemplate deleteMany
   */
  export type TenantShiftTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantShiftTemplates to delete
     */
    where?: TenantShiftTemplateWhereInput
    /**
     * Limit how many TenantShiftTemplates to delete.
     */
    limit?: number
  }

  /**
   * TenantShiftTemplate.rosters
   */
  export type TenantShiftTemplate$rostersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    where?: TenantShiftRosterWhereInput
    orderBy?: TenantShiftRosterOrderByWithRelationInput | TenantShiftRosterOrderByWithRelationInput[]
    cursor?: TenantShiftRosterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantShiftRosterScalarFieldEnum | TenantShiftRosterScalarFieldEnum[]
  }

  /**
   * TenantShiftTemplate without action
   */
  export type TenantShiftTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
  }


  /**
   * Model TenantShiftRoster
   */

  export type AggregateTenantShiftRoster = {
    _count: TenantShiftRosterCountAggregateOutputType | null
    _min: TenantShiftRosterMinAggregateOutputType | null
    _max: TenantShiftRosterMaxAggregateOutputType | null
  }

  export type TenantShiftRosterMinAggregateOutputType = {
    id: string | null
    staffId: string | null
    templateId: string | null
    date: Date | null
    startTime: string | null
    endTime: string | null
    department: string | null
    status: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantShiftRosterMaxAggregateOutputType = {
    id: string | null
    staffId: string | null
    templateId: string | null
    date: Date | null
    startTime: string | null
    endTime: string | null
    department: string | null
    status: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantShiftRosterCountAggregateOutputType = {
    id: number
    staffId: number
    templateId: number
    date: number
    startTime: number
    endTime: number
    department: number
    status: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantShiftRosterMinAggregateInputType = {
    id?: true
    staffId?: true
    templateId?: true
    date?: true
    startTime?: true
    endTime?: true
    department?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantShiftRosterMaxAggregateInputType = {
    id?: true
    staffId?: true
    templateId?: true
    date?: true
    startTime?: true
    endTime?: true
    department?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantShiftRosterCountAggregateInputType = {
    id?: true
    staffId?: true
    templateId?: true
    date?: true
    startTime?: true
    endTime?: true
    department?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantShiftRosterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantShiftRoster to aggregate.
     */
    where?: TenantShiftRosterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantShiftRosters to fetch.
     */
    orderBy?: TenantShiftRosterOrderByWithRelationInput | TenantShiftRosterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantShiftRosterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantShiftRosters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantShiftRosters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantShiftRosters
    **/
    _count?: true | TenantShiftRosterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantShiftRosterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantShiftRosterMaxAggregateInputType
  }

  export type GetTenantShiftRosterAggregateType<T extends TenantShiftRosterAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantShiftRoster]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantShiftRoster[P]>
      : GetScalarType<T[P], AggregateTenantShiftRoster[P]>
  }




  export type TenantShiftRosterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantShiftRosterWhereInput
    orderBy?: TenantShiftRosterOrderByWithAggregationInput | TenantShiftRosterOrderByWithAggregationInput[]
    by: TenantShiftRosterScalarFieldEnum[] | TenantShiftRosterScalarFieldEnum
    having?: TenantShiftRosterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantShiftRosterCountAggregateInputType | true
    _min?: TenantShiftRosterMinAggregateInputType
    _max?: TenantShiftRosterMaxAggregateInputType
  }

  export type TenantShiftRosterGroupByOutputType = {
    id: string
    staffId: string
    templateId: string | null
    date: Date
    startTime: string
    endTime: string
    department: string
    status: string
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: TenantShiftRosterCountAggregateOutputType | null
    _min: TenantShiftRosterMinAggregateOutputType | null
    _max: TenantShiftRosterMaxAggregateOutputType | null
  }

  type GetTenantShiftRosterGroupByPayload<T extends TenantShiftRosterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantShiftRosterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantShiftRosterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantShiftRosterGroupByOutputType[P]>
            : GetScalarType<T[P], TenantShiftRosterGroupByOutputType[P]>
        }
      >
    >


  export type TenantShiftRosterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    staffId?: boolean
    templateId?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    department?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    template?: boolean | TenantShiftRoster$templateArgs<ExtArgs>
    attendance?: boolean | TenantShiftRoster$attendanceArgs<ExtArgs>
  }, ExtArgs["result"]["tenantShiftRoster"]>

  export type TenantShiftRosterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    staffId?: boolean
    templateId?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    department?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    template?: boolean | TenantShiftRoster$templateArgs<ExtArgs>
  }, ExtArgs["result"]["tenantShiftRoster"]>

  export type TenantShiftRosterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    staffId?: boolean
    templateId?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    department?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    template?: boolean | TenantShiftRoster$templateArgs<ExtArgs>
  }, ExtArgs["result"]["tenantShiftRoster"]>

  export type TenantShiftRosterSelectScalar = {
    id?: boolean
    staffId?: boolean
    templateId?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    department?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantShiftRosterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "staffId" | "templateId" | "date" | "startTime" | "endTime" | "department" | "status" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["tenantShiftRoster"]>
  export type TenantShiftRosterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | TenantShiftRoster$templateArgs<ExtArgs>
    attendance?: boolean | TenantShiftRoster$attendanceArgs<ExtArgs>
  }
  export type TenantShiftRosterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | TenantShiftRoster$templateArgs<ExtArgs>
  }
  export type TenantShiftRosterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | TenantShiftRoster$templateArgs<ExtArgs>
  }

  export type $TenantShiftRosterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantShiftRoster"
    objects: {
      template: Prisma.$TenantShiftTemplatePayload<ExtArgs> | null
      attendance: Prisma.$TenantAttendancePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      staffId: string
      templateId: string | null
      date: Date
      startTime: string
      endTime: string
      department: string
      status: string
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenantShiftRoster"]>
    composites: {}
  }

  type TenantShiftRosterGetPayload<S extends boolean | null | undefined | TenantShiftRosterDefaultArgs> = $Result.GetResult<Prisma.$TenantShiftRosterPayload, S>

  type TenantShiftRosterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantShiftRosterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantShiftRosterCountAggregateInputType | true
    }

  export interface TenantShiftRosterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantShiftRoster'], meta: { name: 'TenantShiftRoster' } }
    /**
     * Find zero or one TenantShiftRoster that matches the filter.
     * @param {TenantShiftRosterFindUniqueArgs} args - Arguments to find a TenantShiftRoster
     * @example
     * // Get one TenantShiftRoster
     * const tenantShiftRoster = await prisma.tenantShiftRoster.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantShiftRosterFindUniqueArgs>(args: SelectSubset<T, TenantShiftRosterFindUniqueArgs<ExtArgs>>): Prisma__TenantShiftRosterClient<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantShiftRoster that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantShiftRosterFindUniqueOrThrowArgs} args - Arguments to find a TenantShiftRoster
     * @example
     * // Get one TenantShiftRoster
     * const tenantShiftRoster = await prisma.tenantShiftRoster.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantShiftRosterFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantShiftRosterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantShiftRosterClient<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantShiftRoster that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftRosterFindFirstArgs} args - Arguments to find a TenantShiftRoster
     * @example
     * // Get one TenantShiftRoster
     * const tenantShiftRoster = await prisma.tenantShiftRoster.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantShiftRosterFindFirstArgs>(args?: SelectSubset<T, TenantShiftRosterFindFirstArgs<ExtArgs>>): Prisma__TenantShiftRosterClient<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantShiftRoster that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftRosterFindFirstOrThrowArgs} args - Arguments to find a TenantShiftRoster
     * @example
     * // Get one TenantShiftRoster
     * const tenantShiftRoster = await prisma.tenantShiftRoster.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantShiftRosterFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantShiftRosterFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantShiftRosterClient<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantShiftRosters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftRosterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantShiftRosters
     * const tenantShiftRosters = await prisma.tenantShiftRoster.findMany()
     * 
     * // Get first 10 TenantShiftRosters
     * const tenantShiftRosters = await prisma.tenantShiftRoster.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantShiftRosterWithIdOnly = await prisma.tenantShiftRoster.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantShiftRosterFindManyArgs>(args?: SelectSubset<T, TenantShiftRosterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantShiftRoster.
     * @param {TenantShiftRosterCreateArgs} args - Arguments to create a TenantShiftRoster.
     * @example
     * // Create one TenantShiftRoster
     * const TenantShiftRoster = await prisma.tenantShiftRoster.create({
     *   data: {
     *     // ... data to create a TenantShiftRoster
     *   }
     * })
     * 
     */
    create<T extends TenantShiftRosterCreateArgs>(args: SelectSubset<T, TenantShiftRosterCreateArgs<ExtArgs>>): Prisma__TenantShiftRosterClient<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantShiftRosters.
     * @param {TenantShiftRosterCreateManyArgs} args - Arguments to create many TenantShiftRosters.
     * @example
     * // Create many TenantShiftRosters
     * const tenantShiftRoster = await prisma.tenantShiftRoster.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantShiftRosterCreateManyArgs>(args?: SelectSubset<T, TenantShiftRosterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantShiftRosters and returns the data saved in the database.
     * @param {TenantShiftRosterCreateManyAndReturnArgs} args - Arguments to create many TenantShiftRosters.
     * @example
     * // Create many TenantShiftRosters
     * const tenantShiftRoster = await prisma.tenantShiftRoster.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantShiftRosters and only return the `id`
     * const tenantShiftRosterWithIdOnly = await prisma.tenantShiftRoster.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantShiftRosterCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantShiftRosterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TenantShiftRoster.
     * @param {TenantShiftRosterDeleteArgs} args - Arguments to delete one TenantShiftRoster.
     * @example
     * // Delete one TenantShiftRoster
     * const TenantShiftRoster = await prisma.tenantShiftRoster.delete({
     *   where: {
     *     // ... filter to delete one TenantShiftRoster
     *   }
     * })
     * 
     */
    delete<T extends TenantShiftRosterDeleteArgs>(args: SelectSubset<T, TenantShiftRosterDeleteArgs<ExtArgs>>): Prisma__TenantShiftRosterClient<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantShiftRoster.
     * @param {TenantShiftRosterUpdateArgs} args - Arguments to update one TenantShiftRoster.
     * @example
     * // Update one TenantShiftRoster
     * const tenantShiftRoster = await prisma.tenantShiftRoster.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantShiftRosterUpdateArgs>(args: SelectSubset<T, TenantShiftRosterUpdateArgs<ExtArgs>>): Prisma__TenantShiftRosterClient<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantShiftRosters.
     * @param {TenantShiftRosterDeleteManyArgs} args - Arguments to filter TenantShiftRosters to delete.
     * @example
     * // Delete a few TenantShiftRosters
     * const { count } = await prisma.tenantShiftRoster.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantShiftRosterDeleteManyArgs>(args?: SelectSubset<T, TenantShiftRosterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantShiftRosters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftRosterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantShiftRosters
     * const tenantShiftRoster = await prisma.tenantShiftRoster.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantShiftRosterUpdateManyArgs>(args: SelectSubset<T, TenantShiftRosterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantShiftRosters and returns the data updated in the database.
     * @param {TenantShiftRosterUpdateManyAndReturnArgs} args - Arguments to update many TenantShiftRosters.
     * @example
     * // Update many TenantShiftRosters
     * const tenantShiftRoster = await prisma.tenantShiftRoster.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TenantShiftRosters and only return the `id`
     * const tenantShiftRosterWithIdOnly = await prisma.tenantShiftRoster.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantShiftRosterUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantShiftRosterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TenantShiftRoster.
     * @param {TenantShiftRosterUpsertArgs} args - Arguments to update or create a TenantShiftRoster.
     * @example
     * // Update or create a TenantShiftRoster
     * const tenantShiftRoster = await prisma.tenantShiftRoster.upsert({
     *   create: {
     *     // ... data to create a TenantShiftRoster
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantShiftRoster we want to update
     *   }
     * })
     */
    upsert<T extends TenantShiftRosterUpsertArgs>(args: SelectSubset<T, TenantShiftRosterUpsertArgs<ExtArgs>>): Prisma__TenantShiftRosterClient<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantShiftRosters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftRosterCountArgs} args - Arguments to filter TenantShiftRosters to count.
     * @example
     * // Count the number of TenantShiftRosters
     * const count = await prisma.tenantShiftRoster.count({
     *   where: {
     *     // ... the filter for the TenantShiftRosters we want to count
     *   }
     * })
    **/
    count<T extends TenantShiftRosterCountArgs>(
      args?: Subset<T, TenantShiftRosterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantShiftRosterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantShiftRoster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftRosterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantShiftRosterAggregateArgs>(args: Subset<T, TenantShiftRosterAggregateArgs>): Prisma.PrismaPromise<GetTenantShiftRosterAggregateType<T>>

    /**
     * Group by TenantShiftRoster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantShiftRosterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantShiftRosterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantShiftRosterGroupByArgs['orderBy'] }
        : { orderBy?: TenantShiftRosterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantShiftRosterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantShiftRosterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantShiftRoster model
   */
  readonly fields: TenantShiftRosterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantShiftRoster.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantShiftRosterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    template<T extends TenantShiftRoster$templateArgs<ExtArgs> = {}>(args?: Subset<T, TenantShiftRoster$templateArgs<ExtArgs>>): Prisma__TenantShiftTemplateClient<$Result.GetResult<Prisma.$TenantShiftTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    attendance<T extends TenantShiftRoster$attendanceArgs<ExtArgs> = {}>(args?: Subset<T, TenantShiftRoster$attendanceArgs<ExtArgs>>): Prisma__TenantAttendanceClient<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantShiftRoster model
   */
  interface TenantShiftRosterFieldRefs {
    readonly id: FieldRef<"TenantShiftRoster", 'String'>
    readonly staffId: FieldRef<"TenantShiftRoster", 'String'>
    readonly templateId: FieldRef<"TenantShiftRoster", 'String'>
    readonly date: FieldRef<"TenantShiftRoster", 'DateTime'>
    readonly startTime: FieldRef<"TenantShiftRoster", 'String'>
    readonly endTime: FieldRef<"TenantShiftRoster", 'String'>
    readonly department: FieldRef<"TenantShiftRoster", 'String'>
    readonly status: FieldRef<"TenantShiftRoster", 'String'>
    readonly notes: FieldRef<"TenantShiftRoster", 'String'>
    readonly createdAt: FieldRef<"TenantShiftRoster", 'DateTime'>
    readonly updatedAt: FieldRef<"TenantShiftRoster", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantShiftRoster findUnique
   */
  export type TenantShiftRosterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftRoster to fetch.
     */
    where: TenantShiftRosterWhereUniqueInput
  }

  /**
   * TenantShiftRoster findUniqueOrThrow
   */
  export type TenantShiftRosterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftRoster to fetch.
     */
    where: TenantShiftRosterWhereUniqueInput
  }

  /**
   * TenantShiftRoster findFirst
   */
  export type TenantShiftRosterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftRoster to fetch.
     */
    where?: TenantShiftRosterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantShiftRosters to fetch.
     */
    orderBy?: TenantShiftRosterOrderByWithRelationInput | TenantShiftRosterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantShiftRosters.
     */
    cursor?: TenantShiftRosterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantShiftRosters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantShiftRosters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantShiftRosters.
     */
    distinct?: TenantShiftRosterScalarFieldEnum | TenantShiftRosterScalarFieldEnum[]
  }

  /**
   * TenantShiftRoster findFirstOrThrow
   */
  export type TenantShiftRosterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftRoster to fetch.
     */
    where?: TenantShiftRosterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantShiftRosters to fetch.
     */
    orderBy?: TenantShiftRosterOrderByWithRelationInput | TenantShiftRosterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantShiftRosters.
     */
    cursor?: TenantShiftRosterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantShiftRosters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantShiftRosters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantShiftRosters.
     */
    distinct?: TenantShiftRosterScalarFieldEnum | TenantShiftRosterScalarFieldEnum[]
  }

  /**
   * TenantShiftRoster findMany
   */
  export type TenantShiftRosterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    /**
     * Filter, which TenantShiftRosters to fetch.
     */
    where?: TenantShiftRosterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantShiftRosters to fetch.
     */
    orderBy?: TenantShiftRosterOrderByWithRelationInput | TenantShiftRosterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantShiftRosters.
     */
    cursor?: TenantShiftRosterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantShiftRosters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantShiftRosters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantShiftRosters.
     */
    distinct?: TenantShiftRosterScalarFieldEnum | TenantShiftRosterScalarFieldEnum[]
  }

  /**
   * TenantShiftRoster create
   */
  export type TenantShiftRosterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantShiftRoster.
     */
    data: XOR<TenantShiftRosterCreateInput, TenantShiftRosterUncheckedCreateInput>
  }

  /**
   * TenantShiftRoster createMany
   */
  export type TenantShiftRosterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantShiftRosters.
     */
    data: TenantShiftRosterCreateManyInput | TenantShiftRosterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantShiftRoster createManyAndReturn
   */
  export type TenantShiftRosterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * The data used to create many TenantShiftRosters.
     */
    data: TenantShiftRosterCreateManyInput | TenantShiftRosterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantShiftRoster update
   */
  export type TenantShiftRosterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantShiftRoster.
     */
    data: XOR<TenantShiftRosterUpdateInput, TenantShiftRosterUncheckedUpdateInput>
    /**
     * Choose, which TenantShiftRoster to update.
     */
    where: TenantShiftRosterWhereUniqueInput
  }

  /**
   * TenantShiftRoster updateMany
   */
  export type TenantShiftRosterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantShiftRosters.
     */
    data: XOR<TenantShiftRosterUpdateManyMutationInput, TenantShiftRosterUncheckedUpdateManyInput>
    /**
     * Filter which TenantShiftRosters to update
     */
    where?: TenantShiftRosterWhereInput
    /**
     * Limit how many TenantShiftRosters to update.
     */
    limit?: number
  }

  /**
   * TenantShiftRoster updateManyAndReturn
   */
  export type TenantShiftRosterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * The data used to update TenantShiftRosters.
     */
    data: XOR<TenantShiftRosterUpdateManyMutationInput, TenantShiftRosterUncheckedUpdateManyInput>
    /**
     * Filter which TenantShiftRosters to update
     */
    where?: TenantShiftRosterWhereInput
    /**
     * Limit how many TenantShiftRosters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantShiftRoster upsert
   */
  export type TenantShiftRosterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantShiftRoster to update in case it exists.
     */
    where: TenantShiftRosterWhereUniqueInput
    /**
     * In case the TenantShiftRoster found by the `where` argument doesn't exist, create a new TenantShiftRoster with this data.
     */
    create: XOR<TenantShiftRosterCreateInput, TenantShiftRosterUncheckedCreateInput>
    /**
     * In case the TenantShiftRoster was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantShiftRosterUpdateInput, TenantShiftRosterUncheckedUpdateInput>
  }

  /**
   * TenantShiftRoster delete
   */
  export type TenantShiftRosterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    /**
     * Filter which TenantShiftRoster to delete.
     */
    where: TenantShiftRosterWhereUniqueInput
  }

  /**
   * TenantShiftRoster deleteMany
   */
  export type TenantShiftRosterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantShiftRosters to delete
     */
    where?: TenantShiftRosterWhereInput
    /**
     * Limit how many TenantShiftRosters to delete.
     */
    limit?: number
  }

  /**
   * TenantShiftRoster.template
   */
  export type TenantShiftRoster$templateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftTemplate
     */
    select?: TenantShiftTemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftTemplate
     */
    omit?: TenantShiftTemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftTemplateInclude<ExtArgs> | null
    where?: TenantShiftTemplateWhereInput
  }

  /**
   * TenantShiftRoster.attendance
   */
  export type TenantShiftRoster$attendanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    where?: TenantAttendanceWhereInput
  }

  /**
   * TenantShiftRoster without action
   */
  export type TenantShiftRosterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
  }


  /**
   * Model TenantAttendance
   */

  export type AggregateTenantAttendance = {
    _count: TenantAttendanceCountAggregateOutputType | null
    _avg: TenantAttendanceAvgAggregateOutputType | null
    _sum: TenantAttendanceSumAggregateOutputType | null
    _min: TenantAttendanceMinAggregateOutputType | null
    _max: TenantAttendanceMaxAggregateOutputType | null
  }

  export type TenantAttendanceAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type TenantAttendanceSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type TenantAttendanceMinAggregateOutputType = {
    id: string | null
    staffId: string | null
    rosterId: string | null
    date: Date | null
    checkIn: Date | null
    checkOut: Date | null
    status: string | null
    latitude: number | null
    longitude: number | null
    deviceInfo: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantAttendanceMaxAggregateOutputType = {
    id: string | null
    staffId: string | null
    rosterId: string | null
    date: Date | null
    checkIn: Date | null
    checkOut: Date | null
    status: string | null
    latitude: number | null
    longitude: number | null
    deviceInfo: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantAttendanceCountAggregateOutputType = {
    id: number
    staffId: number
    rosterId: number
    date: number
    checkIn: number
    checkOut: number
    status: number
    latitude: number
    longitude: number
    deviceInfo: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantAttendanceAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type TenantAttendanceSumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type TenantAttendanceMinAggregateInputType = {
    id?: true
    staffId?: true
    rosterId?: true
    date?: true
    checkIn?: true
    checkOut?: true
    status?: true
    latitude?: true
    longitude?: true
    deviceInfo?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantAttendanceMaxAggregateInputType = {
    id?: true
    staffId?: true
    rosterId?: true
    date?: true
    checkIn?: true
    checkOut?: true
    status?: true
    latitude?: true
    longitude?: true
    deviceInfo?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantAttendanceCountAggregateInputType = {
    id?: true
    staffId?: true
    rosterId?: true
    date?: true
    checkIn?: true
    checkOut?: true
    status?: true
    latitude?: true
    longitude?: true
    deviceInfo?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantAttendanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantAttendance to aggregate.
     */
    where?: TenantAttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantAttendances to fetch.
     */
    orderBy?: TenantAttendanceOrderByWithRelationInput | TenantAttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantAttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantAttendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantAttendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantAttendances
    **/
    _count?: true | TenantAttendanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantAttendanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantAttendanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantAttendanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantAttendanceMaxAggregateInputType
  }

  export type GetTenantAttendanceAggregateType<T extends TenantAttendanceAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantAttendance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantAttendance[P]>
      : GetScalarType<T[P], AggregateTenantAttendance[P]>
  }




  export type TenantAttendanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantAttendanceWhereInput
    orderBy?: TenantAttendanceOrderByWithAggregationInput | TenantAttendanceOrderByWithAggregationInput[]
    by: TenantAttendanceScalarFieldEnum[] | TenantAttendanceScalarFieldEnum
    having?: TenantAttendanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantAttendanceCountAggregateInputType | true
    _avg?: TenantAttendanceAvgAggregateInputType
    _sum?: TenantAttendanceSumAggregateInputType
    _min?: TenantAttendanceMinAggregateInputType
    _max?: TenantAttendanceMaxAggregateInputType
  }

  export type TenantAttendanceGroupByOutputType = {
    id: string
    staffId: string
    rosterId: string | null
    date: Date
    checkIn: Date | null
    checkOut: Date | null
    status: string
    latitude: number | null
    longitude: number | null
    deviceInfo: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: TenantAttendanceCountAggregateOutputType | null
    _avg: TenantAttendanceAvgAggregateOutputType | null
    _sum: TenantAttendanceSumAggregateOutputType | null
    _min: TenantAttendanceMinAggregateOutputType | null
    _max: TenantAttendanceMaxAggregateOutputType | null
  }

  type GetTenantAttendanceGroupByPayload<T extends TenantAttendanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantAttendanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantAttendanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantAttendanceGroupByOutputType[P]>
            : GetScalarType<T[P], TenantAttendanceGroupByOutputType[P]>
        }
      >
    >


  export type TenantAttendanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    staffId?: boolean
    rosterId?: boolean
    date?: boolean
    checkIn?: boolean
    checkOut?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    deviceInfo?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roster?: boolean | TenantAttendance$rosterArgs<ExtArgs>
  }, ExtArgs["result"]["tenantAttendance"]>

  export type TenantAttendanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    staffId?: boolean
    rosterId?: boolean
    date?: boolean
    checkIn?: boolean
    checkOut?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    deviceInfo?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roster?: boolean | TenantAttendance$rosterArgs<ExtArgs>
  }, ExtArgs["result"]["tenantAttendance"]>

  export type TenantAttendanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    staffId?: boolean
    rosterId?: boolean
    date?: boolean
    checkIn?: boolean
    checkOut?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    deviceInfo?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roster?: boolean | TenantAttendance$rosterArgs<ExtArgs>
  }, ExtArgs["result"]["tenantAttendance"]>

  export type TenantAttendanceSelectScalar = {
    id?: boolean
    staffId?: boolean
    rosterId?: boolean
    date?: boolean
    checkIn?: boolean
    checkOut?: boolean
    status?: boolean
    latitude?: boolean
    longitude?: boolean
    deviceInfo?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantAttendanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "staffId" | "rosterId" | "date" | "checkIn" | "checkOut" | "status" | "latitude" | "longitude" | "deviceInfo" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["tenantAttendance"]>
  export type TenantAttendanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roster?: boolean | TenantAttendance$rosterArgs<ExtArgs>
  }
  export type TenantAttendanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roster?: boolean | TenantAttendance$rosterArgs<ExtArgs>
  }
  export type TenantAttendanceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roster?: boolean | TenantAttendance$rosterArgs<ExtArgs>
  }

  export type $TenantAttendancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantAttendance"
    objects: {
      roster: Prisma.$TenantShiftRosterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      staffId: string
      rosterId: string | null
      date: Date
      checkIn: Date | null
      checkOut: Date | null
      status: string
      latitude: number | null
      longitude: number | null
      deviceInfo: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenantAttendance"]>
    composites: {}
  }

  type TenantAttendanceGetPayload<S extends boolean | null | undefined | TenantAttendanceDefaultArgs> = $Result.GetResult<Prisma.$TenantAttendancePayload, S>

  type TenantAttendanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantAttendanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantAttendanceCountAggregateInputType | true
    }

  export interface TenantAttendanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantAttendance'], meta: { name: 'TenantAttendance' } }
    /**
     * Find zero or one TenantAttendance that matches the filter.
     * @param {TenantAttendanceFindUniqueArgs} args - Arguments to find a TenantAttendance
     * @example
     * // Get one TenantAttendance
     * const tenantAttendance = await prisma.tenantAttendance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantAttendanceFindUniqueArgs>(args: SelectSubset<T, TenantAttendanceFindUniqueArgs<ExtArgs>>): Prisma__TenantAttendanceClient<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantAttendance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantAttendanceFindUniqueOrThrowArgs} args - Arguments to find a TenantAttendance
     * @example
     * // Get one TenantAttendance
     * const tenantAttendance = await prisma.tenantAttendance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantAttendanceFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantAttendanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantAttendanceClient<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantAttendance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAttendanceFindFirstArgs} args - Arguments to find a TenantAttendance
     * @example
     * // Get one TenantAttendance
     * const tenantAttendance = await prisma.tenantAttendance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantAttendanceFindFirstArgs>(args?: SelectSubset<T, TenantAttendanceFindFirstArgs<ExtArgs>>): Prisma__TenantAttendanceClient<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantAttendance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAttendanceFindFirstOrThrowArgs} args - Arguments to find a TenantAttendance
     * @example
     * // Get one TenantAttendance
     * const tenantAttendance = await prisma.tenantAttendance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantAttendanceFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantAttendanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantAttendanceClient<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantAttendances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAttendanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantAttendances
     * const tenantAttendances = await prisma.tenantAttendance.findMany()
     * 
     * // Get first 10 TenantAttendances
     * const tenantAttendances = await prisma.tenantAttendance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantAttendanceWithIdOnly = await prisma.tenantAttendance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantAttendanceFindManyArgs>(args?: SelectSubset<T, TenantAttendanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantAttendance.
     * @param {TenantAttendanceCreateArgs} args - Arguments to create a TenantAttendance.
     * @example
     * // Create one TenantAttendance
     * const TenantAttendance = await prisma.tenantAttendance.create({
     *   data: {
     *     // ... data to create a TenantAttendance
     *   }
     * })
     * 
     */
    create<T extends TenantAttendanceCreateArgs>(args: SelectSubset<T, TenantAttendanceCreateArgs<ExtArgs>>): Prisma__TenantAttendanceClient<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantAttendances.
     * @param {TenantAttendanceCreateManyArgs} args - Arguments to create many TenantAttendances.
     * @example
     * // Create many TenantAttendances
     * const tenantAttendance = await prisma.tenantAttendance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantAttendanceCreateManyArgs>(args?: SelectSubset<T, TenantAttendanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantAttendances and returns the data saved in the database.
     * @param {TenantAttendanceCreateManyAndReturnArgs} args - Arguments to create many TenantAttendances.
     * @example
     * // Create many TenantAttendances
     * const tenantAttendance = await prisma.tenantAttendance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantAttendances and only return the `id`
     * const tenantAttendanceWithIdOnly = await prisma.tenantAttendance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantAttendanceCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantAttendanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TenantAttendance.
     * @param {TenantAttendanceDeleteArgs} args - Arguments to delete one TenantAttendance.
     * @example
     * // Delete one TenantAttendance
     * const TenantAttendance = await prisma.tenantAttendance.delete({
     *   where: {
     *     // ... filter to delete one TenantAttendance
     *   }
     * })
     * 
     */
    delete<T extends TenantAttendanceDeleteArgs>(args: SelectSubset<T, TenantAttendanceDeleteArgs<ExtArgs>>): Prisma__TenantAttendanceClient<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantAttendance.
     * @param {TenantAttendanceUpdateArgs} args - Arguments to update one TenantAttendance.
     * @example
     * // Update one TenantAttendance
     * const tenantAttendance = await prisma.tenantAttendance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantAttendanceUpdateArgs>(args: SelectSubset<T, TenantAttendanceUpdateArgs<ExtArgs>>): Prisma__TenantAttendanceClient<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantAttendances.
     * @param {TenantAttendanceDeleteManyArgs} args - Arguments to filter TenantAttendances to delete.
     * @example
     * // Delete a few TenantAttendances
     * const { count } = await prisma.tenantAttendance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantAttendanceDeleteManyArgs>(args?: SelectSubset<T, TenantAttendanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantAttendances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAttendanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantAttendances
     * const tenantAttendance = await prisma.tenantAttendance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantAttendanceUpdateManyArgs>(args: SelectSubset<T, TenantAttendanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantAttendances and returns the data updated in the database.
     * @param {TenantAttendanceUpdateManyAndReturnArgs} args - Arguments to update many TenantAttendances.
     * @example
     * // Update many TenantAttendances
     * const tenantAttendance = await prisma.tenantAttendance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TenantAttendances and only return the `id`
     * const tenantAttendanceWithIdOnly = await prisma.tenantAttendance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantAttendanceUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantAttendanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TenantAttendance.
     * @param {TenantAttendanceUpsertArgs} args - Arguments to update or create a TenantAttendance.
     * @example
     * // Update or create a TenantAttendance
     * const tenantAttendance = await prisma.tenantAttendance.upsert({
     *   create: {
     *     // ... data to create a TenantAttendance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantAttendance we want to update
     *   }
     * })
     */
    upsert<T extends TenantAttendanceUpsertArgs>(args: SelectSubset<T, TenantAttendanceUpsertArgs<ExtArgs>>): Prisma__TenantAttendanceClient<$Result.GetResult<Prisma.$TenantAttendancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantAttendances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAttendanceCountArgs} args - Arguments to filter TenantAttendances to count.
     * @example
     * // Count the number of TenantAttendances
     * const count = await prisma.tenantAttendance.count({
     *   where: {
     *     // ... the filter for the TenantAttendances we want to count
     *   }
     * })
    **/
    count<T extends TenantAttendanceCountArgs>(
      args?: Subset<T, TenantAttendanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantAttendanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantAttendance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAttendanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAttendanceAggregateArgs>(args: Subset<T, TenantAttendanceAggregateArgs>): Prisma.PrismaPromise<GetTenantAttendanceAggregateType<T>>

    /**
     * Group by TenantAttendance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAttendanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantAttendanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantAttendanceGroupByArgs['orderBy'] }
        : { orderBy?: TenantAttendanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantAttendanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantAttendanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantAttendance model
   */
  readonly fields: TenantAttendanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantAttendance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantAttendanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roster<T extends TenantAttendance$rosterArgs<ExtArgs> = {}>(args?: Subset<T, TenantAttendance$rosterArgs<ExtArgs>>): Prisma__TenantShiftRosterClient<$Result.GetResult<Prisma.$TenantShiftRosterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantAttendance model
   */
  interface TenantAttendanceFieldRefs {
    readonly id: FieldRef<"TenantAttendance", 'String'>
    readonly staffId: FieldRef<"TenantAttendance", 'String'>
    readonly rosterId: FieldRef<"TenantAttendance", 'String'>
    readonly date: FieldRef<"TenantAttendance", 'DateTime'>
    readonly checkIn: FieldRef<"TenantAttendance", 'DateTime'>
    readonly checkOut: FieldRef<"TenantAttendance", 'DateTime'>
    readonly status: FieldRef<"TenantAttendance", 'String'>
    readonly latitude: FieldRef<"TenantAttendance", 'Float'>
    readonly longitude: FieldRef<"TenantAttendance", 'Float'>
    readonly deviceInfo: FieldRef<"TenantAttendance", 'String'>
    readonly notes: FieldRef<"TenantAttendance", 'String'>
    readonly createdAt: FieldRef<"TenantAttendance", 'DateTime'>
    readonly updatedAt: FieldRef<"TenantAttendance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantAttendance findUnique
   */
  export type TenantAttendanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which TenantAttendance to fetch.
     */
    where: TenantAttendanceWhereUniqueInput
  }

  /**
   * TenantAttendance findUniqueOrThrow
   */
  export type TenantAttendanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which TenantAttendance to fetch.
     */
    where: TenantAttendanceWhereUniqueInput
  }

  /**
   * TenantAttendance findFirst
   */
  export type TenantAttendanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which TenantAttendance to fetch.
     */
    where?: TenantAttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantAttendances to fetch.
     */
    orderBy?: TenantAttendanceOrderByWithRelationInput | TenantAttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantAttendances.
     */
    cursor?: TenantAttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantAttendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantAttendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantAttendances.
     */
    distinct?: TenantAttendanceScalarFieldEnum | TenantAttendanceScalarFieldEnum[]
  }

  /**
   * TenantAttendance findFirstOrThrow
   */
  export type TenantAttendanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which TenantAttendance to fetch.
     */
    where?: TenantAttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantAttendances to fetch.
     */
    orderBy?: TenantAttendanceOrderByWithRelationInput | TenantAttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantAttendances.
     */
    cursor?: TenantAttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantAttendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantAttendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantAttendances.
     */
    distinct?: TenantAttendanceScalarFieldEnum | TenantAttendanceScalarFieldEnum[]
  }

  /**
   * TenantAttendance findMany
   */
  export type TenantAttendanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    /**
     * Filter, which TenantAttendances to fetch.
     */
    where?: TenantAttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantAttendances to fetch.
     */
    orderBy?: TenantAttendanceOrderByWithRelationInput | TenantAttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantAttendances.
     */
    cursor?: TenantAttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantAttendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantAttendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantAttendances.
     */
    distinct?: TenantAttendanceScalarFieldEnum | TenantAttendanceScalarFieldEnum[]
  }

  /**
   * TenantAttendance create
   */
  export type TenantAttendanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantAttendance.
     */
    data: XOR<TenantAttendanceCreateInput, TenantAttendanceUncheckedCreateInput>
  }

  /**
   * TenantAttendance createMany
   */
  export type TenantAttendanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantAttendances.
     */
    data: TenantAttendanceCreateManyInput | TenantAttendanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantAttendance createManyAndReturn
   */
  export type TenantAttendanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * The data used to create many TenantAttendances.
     */
    data: TenantAttendanceCreateManyInput | TenantAttendanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantAttendance update
   */
  export type TenantAttendanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantAttendance.
     */
    data: XOR<TenantAttendanceUpdateInput, TenantAttendanceUncheckedUpdateInput>
    /**
     * Choose, which TenantAttendance to update.
     */
    where: TenantAttendanceWhereUniqueInput
  }

  /**
   * TenantAttendance updateMany
   */
  export type TenantAttendanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantAttendances.
     */
    data: XOR<TenantAttendanceUpdateManyMutationInput, TenantAttendanceUncheckedUpdateManyInput>
    /**
     * Filter which TenantAttendances to update
     */
    where?: TenantAttendanceWhereInput
    /**
     * Limit how many TenantAttendances to update.
     */
    limit?: number
  }

  /**
   * TenantAttendance updateManyAndReturn
   */
  export type TenantAttendanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * The data used to update TenantAttendances.
     */
    data: XOR<TenantAttendanceUpdateManyMutationInput, TenantAttendanceUncheckedUpdateManyInput>
    /**
     * Filter which TenantAttendances to update
     */
    where?: TenantAttendanceWhereInput
    /**
     * Limit how many TenantAttendances to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantAttendance upsert
   */
  export type TenantAttendanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantAttendance to update in case it exists.
     */
    where: TenantAttendanceWhereUniqueInput
    /**
     * In case the TenantAttendance found by the `where` argument doesn't exist, create a new TenantAttendance with this data.
     */
    create: XOR<TenantAttendanceCreateInput, TenantAttendanceUncheckedCreateInput>
    /**
     * In case the TenantAttendance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantAttendanceUpdateInput, TenantAttendanceUncheckedUpdateInput>
  }

  /**
   * TenantAttendance delete
   */
  export type TenantAttendanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
    /**
     * Filter which TenantAttendance to delete.
     */
    where: TenantAttendanceWhereUniqueInput
  }

  /**
   * TenantAttendance deleteMany
   */
  export type TenantAttendanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantAttendances to delete
     */
    where?: TenantAttendanceWhereInput
    /**
     * Limit how many TenantAttendances to delete.
     */
    limit?: number
  }

  /**
   * TenantAttendance.roster
   */
  export type TenantAttendance$rosterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantShiftRoster
     */
    select?: TenantShiftRosterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantShiftRoster
     */
    omit?: TenantShiftRosterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantShiftRosterInclude<ExtArgs> | null
    where?: TenantShiftRosterWhereInput
  }

  /**
   * TenantAttendance without action
   */
  export type TenantAttendanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAttendance
     */
    select?: TenantAttendanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAttendance
     */
    omit?: TenantAttendanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAttendanceInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantUserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    role: 'role',
    consoleRoles: 'consoleRoles',
    status: 'status',
    isRestricted: 'isRestricted',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantUserScalarFieldEnum = (typeof TenantUserScalarFieldEnum)[keyof typeof TenantUserScalarFieldEnum]


  export const PatientScalarFieldEnum: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    bloodGroup: 'bloodGroup',
    address: 'address',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const AppointmentScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    dateTime: 'dateTime',
    status: 'status',
    reason: 'reason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]


  export const DepartmentScalarFieldEnum: {
    id: 'id',
    name: 'name',
    code: 'code',
    description: 'description',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DepartmentScalarFieldEnum = (typeof DepartmentScalarFieldEnum)[keyof typeof DepartmentScalarFieldEnum]


  export const StaffScalarFieldEnum: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    designation: 'designation',
    specialization: 'specialization',
    departmentId: 'departmentId',
    email: 'email',
    phone: 'phone',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StaffScalarFieldEnum = (typeof StaffScalarFieldEnum)[keyof typeof StaffScalarFieldEnum]


  export const BedScalarFieldEnum: {
    id: 'id',
    bedNumber: 'bedNumber',
    wardName: 'wardName',
    type: 'type',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BedScalarFieldEnum = (typeof BedScalarFieldEnum)[keyof typeof BedScalarFieldEnum]


  export const TenantShiftTemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    department: 'department',
    type: 'type',
    startTime: 'startTime',
    endTime: 'endTime',
    breakDuration: 'breakDuration',
    rule: 'rule',
    staffing: 'staffing',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantShiftTemplateScalarFieldEnum = (typeof TenantShiftTemplateScalarFieldEnum)[keyof typeof TenantShiftTemplateScalarFieldEnum]


  export const TenantShiftRosterScalarFieldEnum: {
    id: 'id',
    staffId: 'staffId',
    templateId: 'templateId',
    date: 'date',
    startTime: 'startTime',
    endTime: 'endTime',
    department: 'department',
    status: 'status',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantShiftRosterScalarFieldEnum = (typeof TenantShiftRosterScalarFieldEnum)[keyof typeof TenantShiftRosterScalarFieldEnum]


  export const TenantAttendanceScalarFieldEnum: {
    id: 'id',
    staffId: 'staffId',
    rosterId: 'rosterId',
    date: 'date',
    checkIn: 'checkIn',
    checkOut: 'checkOut',
    status: 'status',
    latitude: 'latitude',
    longitude: 'longitude',
    deviceInfo: 'deviceInfo',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantAttendanceScalarFieldEnum = (typeof TenantAttendanceScalarFieldEnum)[keyof typeof TenantAttendanceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantUserWhereInput = {
    AND?: TenantUserWhereInput | TenantUserWhereInput[]
    OR?: TenantUserWhereInput[]
    NOT?: TenantUserWhereInput | TenantUserWhereInput[]
    id?: StringFilter<"TenantUser"> | string
    email?: StringFilter<"TenantUser"> | string
    name?: StringNullableFilter<"TenantUser"> | string | null
    password?: StringFilter<"TenantUser"> | string
    role?: StringFilter<"TenantUser"> | string
    consoleRoles?: JsonNullableFilter<"TenantUser">
    status?: StringFilter<"TenantUser"> | string
    isRestricted?: BoolFilter<"TenantUser"> | boolean
    createdAt?: DateTimeFilter<"TenantUser"> | Date | string
    updatedAt?: DateTimeFilter<"TenantUser"> | Date | string
  }

  export type TenantUserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrder
    consoleRoles?: SortOrderInput | SortOrder
    status?: SortOrder
    isRestricted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: TenantUserWhereInput | TenantUserWhereInput[]
    OR?: TenantUserWhereInput[]
    NOT?: TenantUserWhereInput | TenantUserWhereInput[]
    name?: StringNullableFilter<"TenantUser"> | string | null
    password?: StringFilter<"TenantUser"> | string
    role?: StringFilter<"TenantUser"> | string
    consoleRoles?: JsonNullableFilter<"TenantUser">
    status?: StringFilter<"TenantUser"> | string
    isRestricted?: BoolFilter<"TenantUser"> | boolean
    createdAt?: DateTimeFilter<"TenantUser"> | Date | string
    updatedAt?: DateTimeFilter<"TenantUser"> | Date | string
  }, "id" | "email">

  export type TenantUserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrder
    consoleRoles?: SortOrderInput | SortOrder
    status?: SortOrder
    isRestricted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantUserCountOrderByAggregateInput
    _max?: TenantUserMaxOrderByAggregateInput
    _min?: TenantUserMinOrderByAggregateInput
  }

  export type TenantUserScalarWhereWithAggregatesInput = {
    AND?: TenantUserScalarWhereWithAggregatesInput | TenantUserScalarWhereWithAggregatesInput[]
    OR?: TenantUserScalarWhereWithAggregatesInput[]
    NOT?: TenantUserScalarWhereWithAggregatesInput | TenantUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantUser"> | string
    email?: StringWithAggregatesFilter<"TenantUser"> | string
    name?: StringNullableWithAggregatesFilter<"TenantUser"> | string | null
    password?: StringWithAggregatesFilter<"TenantUser"> | string
    role?: StringWithAggregatesFilter<"TenantUser"> | string
    consoleRoles?: JsonNullableWithAggregatesFilter<"TenantUser">
    status?: StringWithAggregatesFilter<"TenantUser"> | string
    isRestricted?: BoolWithAggregatesFilter<"TenantUser"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TenantUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TenantUser"> | Date | string
  }

  export type PatientWhereInput = {
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    id?: StringFilter<"Patient"> | string
    firstName?: StringFilter<"Patient"> | string
    lastName?: StringFilter<"Patient"> | string
    email?: StringNullableFilter<"Patient"> | string | null
    phone?: StringNullableFilter<"Patient"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"Patient"> | Date | string | null
    gender?: StringNullableFilter<"Patient"> | string | null
    bloodGroup?: StringNullableFilter<"Patient"> | string | null
    address?: StringNullableFilter<"Patient"> | string | null
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    appointments?: AppointmentListRelationFilter
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    bloodGroup?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
  }

  export type PatientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    firstName?: StringFilter<"Patient"> | string
    lastName?: StringFilter<"Patient"> | string
    email?: StringNullableFilter<"Patient"> | string | null
    phone?: StringNullableFilter<"Patient"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"Patient"> | Date | string | null
    gender?: StringNullableFilter<"Patient"> | string | null
    bloodGroup?: StringNullableFilter<"Patient"> | string | null
    address?: StringNullableFilter<"Patient"> | string | null
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    appointments?: AppointmentListRelationFilter
  }, "id">

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    bloodGroup?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientCountOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    OR?: PatientScalarWhereWithAggregatesInput[]
    NOT?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Patient"> | string
    firstName?: StringWithAggregatesFilter<"Patient"> | string
    lastName?: StringWithAggregatesFilter<"Patient"> | string
    email?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    dateOfBirth?: DateTimeNullableWithAggregatesFilter<"Patient"> | Date | string | null
    gender?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    bloodGroup?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    address?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
  }

  export type AppointmentWhereInput = {
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    id?: StringFilter<"Appointment"> | string
    patientId?: StringFilter<"Appointment"> | string
    dateTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: StringFilter<"Appointment"> | string
    reason?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
  }

  export type AppointmentOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    patientId?: StringFilter<"Appointment"> | string
    dateTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: StringFilter<"Appointment"> | string
    reason?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
  }, "id">

  export type AppointmentOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AppointmentCountOrderByAggregateInput
    _max?: AppointmentMaxOrderByAggregateInput
    _min?: AppointmentMinOrderByAggregateInput
  }

  export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    OR?: AppointmentScalarWhereWithAggregatesInput[]
    NOT?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Appointment"> | string
    patientId?: StringWithAggregatesFilter<"Appointment"> | string
    dateTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    status?: StringWithAggregatesFilter<"Appointment"> | string
    reason?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
  }

  export type DepartmentWhereInput = {
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    id?: StringFilter<"Department"> | string
    name?: StringFilter<"Department"> | string
    code?: StringFilter<"Department"> | string
    description?: StringNullableFilter<"Department"> | string | null
    active?: BoolFilter<"Department"> | boolean
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
    specialists?: StaffListRelationFilter
  }

  export type DepartmentOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    description?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    specialists?: StaffOrderByRelationAggregateInput
  }

  export type DepartmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    name?: StringFilter<"Department"> | string
    description?: StringNullableFilter<"Department"> | string | null
    active?: BoolFilter<"Department"> | boolean
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
    specialists?: StaffListRelationFilter
  }, "id" | "code">

  export type DepartmentOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    description?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DepartmentCountOrderByAggregateInput
    _max?: DepartmentMaxOrderByAggregateInput
    _min?: DepartmentMinOrderByAggregateInput
  }

  export type DepartmentScalarWhereWithAggregatesInput = {
    AND?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    OR?: DepartmentScalarWhereWithAggregatesInput[]
    NOT?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Department"> | string
    name?: StringWithAggregatesFilter<"Department"> | string
    code?: StringWithAggregatesFilter<"Department"> | string
    description?: StringNullableWithAggregatesFilter<"Department"> | string | null
    active?: BoolWithAggregatesFilter<"Department"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
  }

  export type StaffWhereInput = {
    AND?: StaffWhereInput | StaffWhereInput[]
    OR?: StaffWhereInput[]
    NOT?: StaffWhereInput | StaffWhereInput[]
    id?: StringFilter<"Staff"> | string
    firstName?: StringFilter<"Staff"> | string
    lastName?: StringFilter<"Staff"> | string
    designation?: StringFilter<"Staff"> | string
    specialization?: StringNullableFilter<"Staff"> | string | null
    departmentId?: StringNullableFilter<"Staff"> | string | null
    email?: StringFilter<"Staff"> | string
    phone?: StringNullableFilter<"Staff"> | string | null
    active?: BoolFilter<"Staff"> | boolean
    createdAt?: DateTimeFilter<"Staff"> | Date | string
    updatedAt?: DateTimeFilter<"Staff"> | Date | string
    department?: XOR<DepartmentNullableScalarRelationFilter, DepartmentWhereInput> | null
  }

  export type StaffOrderByWithRelationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    specialization?: SortOrderInput | SortOrder
    departmentId?: SortOrderInput | SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    department?: DepartmentOrderByWithRelationInput
  }

  export type StaffWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: StaffWhereInput | StaffWhereInput[]
    OR?: StaffWhereInput[]
    NOT?: StaffWhereInput | StaffWhereInput[]
    firstName?: StringFilter<"Staff"> | string
    lastName?: StringFilter<"Staff"> | string
    designation?: StringFilter<"Staff"> | string
    specialization?: StringNullableFilter<"Staff"> | string | null
    departmentId?: StringNullableFilter<"Staff"> | string | null
    phone?: StringNullableFilter<"Staff"> | string | null
    active?: BoolFilter<"Staff"> | boolean
    createdAt?: DateTimeFilter<"Staff"> | Date | string
    updatedAt?: DateTimeFilter<"Staff"> | Date | string
    department?: XOR<DepartmentNullableScalarRelationFilter, DepartmentWhereInput> | null
  }, "id" | "email">

  export type StaffOrderByWithAggregationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    specialization?: SortOrderInput | SortOrder
    departmentId?: SortOrderInput | SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StaffCountOrderByAggregateInput
    _max?: StaffMaxOrderByAggregateInput
    _min?: StaffMinOrderByAggregateInput
  }

  export type StaffScalarWhereWithAggregatesInput = {
    AND?: StaffScalarWhereWithAggregatesInput | StaffScalarWhereWithAggregatesInput[]
    OR?: StaffScalarWhereWithAggregatesInput[]
    NOT?: StaffScalarWhereWithAggregatesInput | StaffScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Staff"> | string
    firstName?: StringWithAggregatesFilter<"Staff"> | string
    lastName?: StringWithAggregatesFilter<"Staff"> | string
    designation?: StringWithAggregatesFilter<"Staff"> | string
    specialization?: StringNullableWithAggregatesFilter<"Staff"> | string | null
    departmentId?: StringNullableWithAggregatesFilter<"Staff"> | string | null
    email?: StringWithAggregatesFilter<"Staff"> | string
    phone?: StringNullableWithAggregatesFilter<"Staff"> | string | null
    active?: BoolWithAggregatesFilter<"Staff"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Staff"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Staff"> | Date | string
  }

  export type BedWhereInput = {
    AND?: BedWhereInput | BedWhereInput[]
    OR?: BedWhereInput[]
    NOT?: BedWhereInput | BedWhereInput[]
    id?: StringFilter<"Bed"> | string
    bedNumber?: StringFilter<"Bed"> | string
    wardName?: StringFilter<"Bed"> | string
    type?: StringFilter<"Bed"> | string
    status?: StringFilter<"Bed"> | string
    createdAt?: DateTimeFilter<"Bed"> | Date | string
    updatedAt?: DateTimeFilter<"Bed"> | Date | string
  }

  export type BedOrderByWithRelationInput = {
    id?: SortOrder
    bedNumber?: SortOrder
    wardName?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BedWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    bedNumber?: string
    AND?: BedWhereInput | BedWhereInput[]
    OR?: BedWhereInput[]
    NOT?: BedWhereInput | BedWhereInput[]
    wardName?: StringFilter<"Bed"> | string
    type?: StringFilter<"Bed"> | string
    status?: StringFilter<"Bed"> | string
    createdAt?: DateTimeFilter<"Bed"> | Date | string
    updatedAt?: DateTimeFilter<"Bed"> | Date | string
  }, "id" | "bedNumber">

  export type BedOrderByWithAggregationInput = {
    id?: SortOrder
    bedNumber?: SortOrder
    wardName?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BedCountOrderByAggregateInput
    _max?: BedMaxOrderByAggregateInput
    _min?: BedMinOrderByAggregateInput
  }

  export type BedScalarWhereWithAggregatesInput = {
    AND?: BedScalarWhereWithAggregatesInput | BedScalarWhereWithAggregatesInput[]
    OR?: BedScalarWhereWithAggregatesInput[]
    NOT?: BedScalarWhereWithAggregatesInput | BedScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bed"> | string
    bedNumber?: StringWithAggregatesFilter<"Bed"> | string
    wardName?: StringWithAggregatesFilter<"Bed"> | string
    type?: StringWithAggregatesFilter<"Bed"> | string
    status?: StringWithAggregatesFilter<"Bed"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Bed"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Bed"> | Date | string
  }

  export type TenantShiftTemplateWhereInput = {
    AND?: TenantShiftTemplateWhereInput | TenantShiftTemplateWhereInput[]
    OR?: TenantShiftTemplateWhereInput[]
    NOT?: TenantShiftTemplateWhereInput | TenantShiftTemplateWhereInput[]
    id?: StringFilter<"TenantShiftTemplate"> | string
    name?: StringFilter<"TenantShiftTemplate"> | string
    department?: StringFilter<"TenantShiftTemplate"> | string
    type?: StringFilter<"TenantShiftTemplate"> | string
    startTime?: StringFilter<"TenantShiftTemplate"> | string
    endTime?: StringFilter<"TenantShiftTemplate"> | string
    breakDuration?: StringFilter<"TenantShiftTemplate"> | string
    rule?: StringFilter<"TenantShiftTemplate"> | string
    staffing?: JsonFilter<"TenantShiftTemplate">
    createdAt?: DateTimeFilter<"TenantShiftTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"TenantShiftTemplate"> | Date | string
    rosters?: TenantShiftRosterListRelationFilter
  }

  export type TenantShiftTemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    department?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakDuration?: SortOrder
    rule?: SortOrder
    staffing?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rosters?: TenantShiftRosterOrderByRelationAggregateInput
  }

  export type TenantShiftTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TenantShiftTemplateWhereInput | TenantShiftTemplateWhereInput[]
    OR?: TenantShiftTemplateWhereInput[]
    NOT?: TenantShiftTemplateWhereInput | TenantShiftTemplateWhereInput[]
    name?: StringFilter<"TenantShiftTemplate"> | string
    department?: StringFilter<"TenantShiftTemplate"> | string
    type?: StringFilter<"TenantShiftTemplate"> | string
    startTime?: StringFilter<"TenantShiftTemplate"> | string
    endTime?: StringFilter<"TenantShiftTemplate"> | string
    breakDuration?: StringFilter<"TenantShiftTemplate"> | string
    rule?: StringFilter<"TenantShiftTemplate"> | string
    staffing?: JsonFilter<"TenantShiftTemplate">
    createdAt?: DateTimeFilter<"TenantShiftTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"TenantShiftTemplate"> | Date | string
    rosters?: TenantShiftRosterListRelationFilter
  }, "id">

  export type TenantShiftTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    department?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakDuration?: SortOrder
    rule?: SortOrder
    staffing?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantShiftTemplateCountOrderByAggregateInput
    _max?: TenantShiftTemplateMaxOrderByAggregateInput
    _min?: TenantShiftTemplateMinOrderByAggregateInput
  }

  export type TenantShiftTemplateScalarWhereWithAggregatesInput = {
    AND?: TenantShiftTemplateScalarWhereWithAggregatesInput | TenantShiftTemplateScalarWhereWithAggregatesInput[]
    OR?: TenantShiftTemplateScalarWhereWithAggregatesInput[]
    NOT?: TenantShiftTemplateScalarWhereWithAggregatesInput | TenantShiftTemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantShiftTemplate"> | string
    name?: StringWithAggregatesFilter<"TenantShiftTemplate"> | string
    department?: StringWithAggregatesFilter<"TenantShiftTemplate"> | string
    type?: StringWithAggregatesFilter<"TenantShiftTemplate"> | string
    startTime?: StringWithAggregatesFilter<"TenantShiftTemplate"> | string
    endTime?: StringWithAggregatesFilter<"TenantShiftTemplate"> | string
    breakDuration?: StringWithAggregatesFilter<"TenantShiftTemplate"> | string
    rule?: StringWithAggregatesFilter<"TenantShiftTemplate"> | string
    staffing?: JsonWithAggregatesFilter<"TenantShiftTemplate">
    createdAt?: DateTimeWithAggregatesFilter<"TenantShiftTemplate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TenantShiftTemplate"> | Date | string
  }

  export type TenantShiftRosterWhereInput = {
    AND?: TenantShiftRosterWhereInput | TenantShiftRosterWhereInput[]
    OR?: TenantShiftRosterWhereInput[]
    NOT?: TenantShiftRosterWhereInput | TenantShiftRosterWhereInput[]
    id?: StringFilter<"TenantShiftRoster"> | string
    staffId?: StringFilter<"TenantShiftRoster"> | string
    templateId?: StringNullableFilter<"TenantShiftRoster"> | string | null
    date?: DateTimeFilter<"TenantShiftRoster"> | Date | string
    startTime?: StringFilter<"TenantShiftRoster"> | string
    endTime?: StringFilter<"TenantShiftRoster"> | string
    department?: StringFilter<"TenantShiftRoster"> | string
    status?: StringFilter<"TenantShiftRoster"> | string
    notes?: StringNullableFilter<"TenantShiftRoster"> | string | null
    createdAt?: DateTimeFilter<"TenantShiftRoster"> | Date | string
    updatedAt?: DateTimeFilter<"TenantShiftRoster"> | Date | string
    template?: XOR<TenantShiftTemplateNullableScalarRelationFilter, TenantShiftTemplateWhereInput> | null
    attendance?: XOR<TenantAttendanceNullableScalarRelationFilter, TenantAttendanceWhereInput> | null
  }

  export type TenantShiftRosterOrderByWithRelationInput = {
    id?: SortOrder
    staffId?: SortOrder
    templateId?: SortOrderInput | SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    department?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    template?: TenantShiftTemplateOrderByWithRelationInput
    attendance?: TenantAttendanceOrderByWithRelationInput
  }

  export type TenantShiftRosterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TenantShiftRosterWhereInput | TenantShiftRosterWhereInput[]
    OR?: TenantShiftRosterWhereInput[]
    NOT?: TenantShiftRosterWhereInput | TenantShiftRosterWhereInput[]
    staffId?: StringFilter<"TenantShiftRoster"> | string
    templateId?: StringNullableFilter<"TenantShiftRoster"> | string | null
    date?: DateTimeFilter<"TenantShiftRoster"> | Date | string
    startTime?: StringFilter<"TenantShiftRoster"> | string
    endTime?: StringFilter<"TenantShiftRoster"> | string
    department?: StringFilter<"TenantShiftRoster"> | string
    status?: StringFilter<"TenantShiftRoster"> | string
    notes?: StringNullableFilter<"TenantShiftRoster"> | string | null
    createdAt?: DateTimeFilter<"TenantShiftRoster"> | Date | string
    updatedAt?: DateTimeFilter<"TenantShiftRoster"> | Date | string
    template?: XOR<TenantShiftTemplateNullableScalarRelationFilter, TenantShiftTemplateWhereInput> | null
    attendance?: XOR<TenantAttendanceNullableScalarRelationFilter, TenantAttendanceWhereInput> | null
  }, "id">

  export type TenantShiftRosterOrderByWithAggregationInput = {
    id?: SortOrder
    staffId?: SortOrder
    templateId?: SortOrderInput | SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    department?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantShiftRosterCountOrderByAggregateInput
    _max?: TenantShiftRosterMaxOrderByAggregateInput
    _min?: TenantShiftRosterMinOrderByAggregateInput
  }

  export type TenantShiftRosterScalarWhereWithAggregatesInput = {
    AND?: TenantShiftRosterScalarWhereWithAggregatesInput | TenantShiftRosterScalarWhereWithAggregatesInput[]
    OR?: TenantShiftRosterScalarWhereWithAggregatesInput[]
    NOT?: TenantShiftRosterScalarWhereWithAggregatesInput | TenantShiftRosterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantShiftRoster"> | string
    staffId?: StringWithAggregatesFilter<"TenantShiftRoster"> | string
    templateId?: StringNullableWithAggregatesFilter<"TenantShiftRoster"> | string | null
    date?: DateTimeWithAggregatesFilter<"TenantShiftRoster"> | Date | string
    startTime?: StringWithAggregatesFilter<"TenantShiftRoster"> | string
    endTime?: StringWithAggregatesFilter<"TenantShiftRoster"> | string
    department?: StringWithAggregatesFilter<"TenantShiftRoster"> | string
    status?: StringWithAggregatesFilter<"TenantShiftRoster"> | string
    notes?: StringNullableWithAggregatesFilter<"TenantShiftRoster"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TenantShiftRoster"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TenantShiftRoster"> | Date | string
  }

  export type TenantAttendanceWhereInput = {
    AND?: TenantAttendanceWhereInput | TenantAttendanceWhereInput[]
    OR?: TenantAttendanceWhereInput[]
    NOT?: TenantAttendanceWhereInput | TenantAttendanceWhereInput[]
    id?: StringFilter<"TenantAttendance"> | string
    staffId?: StringFilter<"TenantAttendance"> | string
    rosterId?: StringNullableFilter<"TenantAttendance"> | string | null
    date?: DateTimeFilter<"TenantAttendance"> | Date | string
    checkIn?: DateTimeNullableFilter<"TenantAttendance"> | Date | string | null
    checkOut?: DateTimeNullableFilter<"TenantAttendance"> | Date | string | null
    status?: StringFilter<"TenantAttendance"> | string
    latitude?: FloatNullableFilter<"TenantAttendance"> | number | null
    longitude?: FloatNullableFilter<"TenantAttendance"> | number | null
    deviceInfo?: StringNullableFilter<"TenantAttendance"> | string | null
    notes?: StringNullableFilter<"TenantAttendance"> | string | null
    createdAt?: DateTimeFilter<"TenantAttendance"> | Date | string
    updatedAt?: DateTimeFilter<"TenantAttendance"> | Date | string
    roster?: XOR<TenantShiftRosterNullableScalarRelationFilter, TenantShiftRosterWhereInput> | null
  }

  export type TenantAttendanceOrderByWithRelationInput = {
    id?: SortOrder
    staffId?: SortOrder
    rosterId?: SortOrderInput | SortOrder
    date?: SortOrder
    checkIn?: SortOrderInput | SortOrder
    checkOut?: SortOrderInput | SortOrder
    status?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roster?: TenantShiftRosterOrderByWithRelationInput
  }

  export type TenantAttendanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    rosterId?: string
    AND?: TenantAttendanceWhereInput | TenantAttendanceWhereInput[]
    OR?: TenantAttendanceWhereInput[]
    NOT?: TenantAttendanceWhereInput | TenantAttendanceWhereInput[]
    staffId?: StringFilter<"TenantAttendance"> | string
    date?: DateTimeFilter<"TenantAttendance"> | Date | string
    checkIn?: DateTimeNullableFilter<"TenantAttendance"> | Date | string | null
    checkOut?: DateTimeNullableFilter<"TenantAttendance"> | Date | string | null
    status?: StringFilter<"TenantAttendance"> | string
    latitude?: FloatNullableFilter<"TenantAttendance"> | number | null
    longitude?: FloatNullableFilter<"TenantAttendance"> | number | null
    deviceInfo?: StringNullableFilter<"TenantAttendance"> | string | null
    notes?: StringNullableFilter<"TenantAttendance"> | string | null
    createdAt?: DateTimeFilter<"TenantAttendance"> | Date | string
    updatedAt?: DateTimeFilter<"TenantAttendance"> | Date | string
    roster?: XOR<TenantShiftRosterNullableScalarRelationFilter, TenantShiftRosterWhereInput> | null
  }, "id" | "rosterId">

  export type TenantAttendanceOrderByWithAggregationInput = {
    id?: SortOrder
    staffId?: SortOrder
    rosterId?: SortOrderInput | SortOrder
    date?: SortOrder
    checkIn?: SortOrderInput | SortOrder
    checkOut?: SortOrderInput | SortOrder
    status?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantAttendanceCountOrderByAggregateInput
    _avg?: TenantAttendanceAvgOrderByAggregateInput
    _max?: TenantAttendanceMaxOrderByAggregateInput
    _min?: TenantAttendanceMinOrderByAggregateInput
    _sum?: TenantAttendanceSumOrderByAggregateInput
  }

  export type TenantAttendanceScalarWhereWithAggregatesInput = {
    AND?: TenantAttendanceScalarWhereWithAggregatesInput | TenantAttendanceScalarWhereWithAggregatesInput[]
    OR?: TenantAttendanceScalarWhereWithAggregatesInput[]
    NOT?: TenantAttendanceScalarWhereWithAggregatesInput | TenantAttendanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantAttendance"> | string
    staffId?: StringWithAggregatesFilter<"TenantAttendance"> | string
    rosterId?: StringNullableWithAggregatesFilter<"TenantAttendance"> | string | null
    date?: DateTimeWithAggregatesFilter<"TenantAttendance"> | Date | string
    checkIn?: DateTimeNullableWithAggregatesFilter<"TenantAttendance"> | Date | string | null
    checkOut?: DateTimeNullableWithAggregatesFilter<"TenantAttendance"> | Date | string | null
    status?: StringWithAggregatesFilter<"TenantAttendance"> | string
    latitude?: FloatNullableWithAggregatesFilter<"TenantAttendance"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"TenantAttendance"> | number | null
    deviceInfo?: StringNullableWithAggregatesFilter<"TenantAttendance"> | string | null
    notes?: StringNullableWithAggregatesFilter<"TenantAttendance"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TenantAttendance"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TenantAttendance"> | Date | string
  }

  export type TenantUserCreateInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role?: string
    consoleRoles?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    isRestricted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantUserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role?: string
    consoleRoles?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    isRestricted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    consoleRoles?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    isRestricted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    consoleRoles?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    isRestricted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    role?: string
    consoleRoles?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    isRestricted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    consoleRoles?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    isRestricted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    consoleRoles?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    isRestricted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientCreateInput = {
    id?: string
    firstName: string
    lastName: string
    email?: string | null
    phone?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    bloodGroup?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateInput = {
    id?: string
    firstName: string
    lastName: string
    email?: string | null
    phone?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    bloodGroup?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateManyInput = {
    id?: string
    firstName: string
    lastName: string
    email?: string | null
    phone?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    bloodGroup?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateInput = {
    id?: string
    dateTime: Date | string
    status?: string
    reason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateInput = {
    id?: string
    patientId: string
    dateTime: Date | string
    status?: string
    reason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateManyInput = {
    id?: string
    patientId: string
    dateTime: Date | string
    status?: string
    reason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentCreateInput = {
    id?: string
    name: string
    code: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    specialists?: StaffCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateInput = {
    id?: string
    name: string
    code: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    specialists?: StaffUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    specialists?: StaffUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    specialists?: StaffUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentCreateManyInput = {
    id?: string
    name: string
    code: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffCreateInput = {
    id?: string
    firstName: string
    lastName: string
    designation: string
    specialization?: string | null
    email: string
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    department?: DepartmentCreateNestedOneWithoutSpecialistsInput
  }

  export type StaffUncheckedCreateInput = {
    id?: string
    firstName: string
    lastName: string
    designation: string
    specialization?: string | null
    departmentId?: string | null
    email: string
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StaffUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    specialization?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneWithoutSpecialistsNestedInput
  }

  export type StaffUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    specialization?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffCreateManyInput = {
    id?: string
    firstName: string
    lastName: string
    designation: string
    specialization?: string | null
    departmentId?: string | null
    email: string
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StaffUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    specialization?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    specialization?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BedCreateInput = {
    id?: string
    bedNumber: string
    wardName: string
    type: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BedUncheckedCreateInput = {
    id?: string
    bedNumber: string
    wardName: string
    type: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bedNumber?: StringFieldUpdateOperationsInput | string
    wardName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BedUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bedNumber?: StringFieldUpdateOperationsInput | string
    wardName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BedCreateManyInput = {
    id?: string
    bedNumber: string
    wardName: string
    type: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BedUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bedNumber?: StringFieldUpdateOperationsInput | string
    wardName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BedUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bedNumber?: StringFieldUpdateOperationsInput | string
    wardName?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantShiftTemplateCreateInput = {
    id?: string
    name: string
    department: string
    type: string
    startTime: string
    endTime: string
    breakDuration: string
    rule: string
    staffing: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    rosters?: TenantShiftRosterCreateNestedManyWithoutTemplateInput
  }

  export type TenantShiftTemplateUncheckedCreateInput = {
    id?: string
    name: string
    department: string
    type: string
    startTime: string
    endTime: string
    breakDuration: string
    rule: string
    staffing: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    rosters?: TenantShiftRosterUncheckedCreateNestedManyWithoutTemplateInput
  }

  export type TenantShiftTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakDuration?: StringFieldUpdateOperationsInput | string
    rule?: StringFieldUpdateOperationsInput | string
    staffing?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rosters?: TenantShiftRosterUpdateManyWithoutTemplateNestedInput
  }

  export type TenantShiftTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakDuration?: StringFieldUpdateOperationsInput | string
    rule?: StringFieldUpdateOperationsInput | string
    staffing?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rosters?: TenantShiftRosterUncheckedUpdateManyWithoutTemplateNestedInput
  }

  export type TenantShiftTemplateCreateManyInput = {
    id?: string
    name: string
    department: string
    type: string
    startTime: string
    endTime: string
    breakDuration: string
    rule: string
    staffing: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantShiftTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakDuration?: StringFieldUpdateOperationsInput | string
    rule?: StringFieldUpdateOperationsInput | string
    staffing?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantShiftTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakDuration?: StringFieldUpdateOperationsInput | string
    rule?: StringFieldUpdateOperationsInput | string
    staffing?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantShiftRosterCreateInput = {
    id?: string
    staffId: string
    date: Date | string
    startTime: string
    endTime: string
    department: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    template?: TenantShiftTemplateCreateNestedOneWithoutRostersInput
    attendance?: TenantAttendanceCreateNestedOneWithoutRosterInput
  }

  export type TenantShiftRosterUncheckedCreateInput = {
    id?: string
    staffId: string
    templateId?: string | null
    date: Date | string
    startTime: string
    endTime: string
    department: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendance?: TenantAttendanceUncheckedCreateNestedOneWithoutRosterInput
  }

  export type TenantShiftRosterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    template?: TenantShiftTemplateUpdateOneWithoutRostersNestedInput
    attendance?: TenantAttendanceUpdateOneWithoutRosterNestedInput
  }

  export type TenantShiftRosterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance?: TenantAttendanceUncheckedUpdateOneWithoutRosterNestedInput
  }

  export type TenantShiftRosterCreateManyInput = {
    id?: string
    staffId: string
    templateId?: string | null
    date: Date | string
    startTime: string
    endTime: string
    department: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantShiftRosterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantShiftRosterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantAttendanceCreateInput = {
    id?: string
    staffId: string
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deviceInfo?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    roster?: TenantShiftRosterCreateNestedOneWithoutAttendanceInput
  }

  export type TenantAttendanceUncheckedCreateInput = {
    id?: string
    staffId: string
    rosterId?: string | null
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deviceInfo?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantAttendanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roster?: TenantShiftRosterUpdateOneWithoutAttendanceNestedInput
  }

  export type TenantAttendanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    rosterId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantAttendanceCreateManyInput = {
    id?: string
    staffId: string
    rosterId?: string | null
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deviceInfo?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantAttendanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantAttendanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    rosterId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TenantUserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    consoleRoles?: SortOrder
    status?: SortOrder
    isRestricted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantUserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    isRestricted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantUserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    isRestricted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AppointmentListRelationFilter = {
    every?: AppointmentWhereInput
    some?: AppointmentWhereInput
    none?: AppointmentWhereInput
  }

  export type AppointmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    bloodGroup?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    bloodGroup?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    bloodGroup?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PatientScalarRelationFilter = {
    is?: PatientWhereInput
    isNot?: PatientWhereInput
  }

  export type AppointmentCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    dateTime?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StaffListRelationFilter = {
    every?: StaffWhereInput
    some?: StaffWhereInput
    none?: StaffWhereInput
  }

  export type StaffOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    description?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    description?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    description?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentNullableScalarRelationFilter = {
    is?: DepartmentWhereInput | null
    isNot?: DepartmentWhereInput | null
  }

  export type StaffCountOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    specialization?: SortOrder
    departmentId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StaffMaxOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    specialization?: SortOrder
    departmentId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StaffMinOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    specialization?: SortOrder
    departmentId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BedCountOrderByAggregateInput = {
    id?: SortOrder
    bedNumber?: SortOrder
    wardName?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BedMaxOrderByAggregateInput = {
    id?: SortOrder
    bedNumber?: SortOrder
    wardName?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BedMinOrderByAggregateInput = {
    id?: SortOrder
    bedNumber?: SortOrder
    wardName?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TenantShiftRosterListRelationFilter = {
    every?: TenantShiftRosterWhereInput
    some?: TenantShiftRosterWhereInput
    none?: TenantShiftRosterWhereInput
  }

  export type TenantShiftRosterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantShiftTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    department?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakDuration?: SortOrder
    rule?: SortOrder
    staffing?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantShiftTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    department?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakDuration?: SortOrder
    rule?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantShiftTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    department?: SortOrder
    type?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakDuration?: SortOrder
    rule?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type TenantShiftTemplateNullableScalarRelationFilter = {
    is?: TenantShiftTemplateWhereInput | null
    isNot?: TenantShiftTemplateWhereInput | null
  }

  export type TenantAttendanceNullableScalarRelationFilter = {
    is?: TenantAttendanceWhereInput | null
    isNot?: TenantAttendanceWhereInput | null
  }

  export type TenantShiftRosterCountOrderByAggregateInput = {
    id?: SortOrder
    staffId?: SortOrder
    templateId?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    department?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantShiftRosterMaxOrderByAggregateInput = {
    id?: SortOrder
    staffId?: SortOrder
    templateId?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    department?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantShiftRosterMinOrderByAggregateInput = {
    id?: SortOrder
    staffId?: SortOrder
    templateId?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    department?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type TenantShiftRosterNullableScalarRelationFilter = {
    is?: TenantShiftRosterWhereInput | null
    isNot?: TenantShiftRosterWhereInput | null
  }

  export type TenantAttendanceCountOrderByAggregateInput = {
    id?: SortOrder
    staffId?: SortOrder
    rosterId?: SortOrder
    date?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    status?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    deviceInfo?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantAttendanceAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type TenantAttendanceMaxOrderByAggregateInput = {
    id?: SortOrder
    staffId?: SortOrder
    rosterId?: SortOrder
    date?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    status?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    deviceInfo?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantAttendanceMinOrderByAggregateInput = {
    id?: SortOrder
    staffId?: SortOrder
    rosterId?: SortOrder
    date?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    status?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    deviceInfo?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantAttendanceSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AppointmentCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AppointmentUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PatientCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAppointmentsInput
    connect?: PatientWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAppointmentsInput
    upsert?: PatientUpsertWithoutAppointmentsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutAppointmentsInput, PatientUpdateWithoutAppointmentsInput>, PatientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type StaffCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<StaffCreateWithoutDepartmentInput, StaffUncheckedCreateWithoutDepartmentInput> | StaffCreateWithoutDepartmentInput[] | StaffUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutDepartmentInput | StaffCreateOrConnectWithoutDepartmentInput[]
    createMany?: StaffCreateManyDepartmentInputEnvelope
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
  }

  export type StaffUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<StaffCreateWithoutDepartmentInput, StaffUncheckedCreateWithoutDepartmentInput> | StaffCreateWithoutDepartmentInput[] | StaffUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutDepartmentInput | StaffCreateOrConnectWithoutDepartmentInput[]
    createMany?: StaffCreateManyDepartmentInputEnvelope
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
  }

  export type StaffUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<StaffCreateWithoutDepartmentInput, StaffUncheckedCreateWithoutDepartmentInput> | StaffCreateWithoutDepartmentInput[] | StaffUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutDepartmentInput | StaffCreateOrConnectWithoutDepartmentInput[]
    upsert?: StaffUpsertWithWhereUniqueWithoutDepartmentInput | StaffUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: StaffCreateManyDepartmentInputEnvelope
    set?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    disconnect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    delete?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    update?: StaffUpdateWithWhereUniqueWithoutDepartmentInput | StaffUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: StaffUpdateManyWithWhereWithoutDepartmentInput | StaffUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: StaffScalarWhereInput | StaffScalarWhereInput[]
  }

  export type StaffUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<StaffCreateWithoutDepartmentInput, StaffUncheckedCreateWithoutDepartmentInput> | StaffCreateWithoutDepartmentInput[] | StaffUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutDepartmentInput | StaffCreateOrConnectWithoutDepartmentInput[]
    upsert?: StaffUpsertWithWhereUniqueWithoutDepartmentInput | StaffUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: StaffCreateManyDepartmentInputEnvelope
    set?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    disconnect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    delete?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    update?: StaffUpdateWithWhereUniqueWithoutDepartmentInput | StaffUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: StaffUpdateManyWithWhereWithoutDepartmentInput | StaffUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: StaffScalarWhereInput | StaffScalarWhereInput[]
  }

  export type DepartmentCreateNestedOneWithoutSpecialistsInput = {
    create?: XOR<DepartmentCreateWithoutSpecialistsInput, DepartmentUncheckedCreateWithoutSpecialistsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutSpecialistsInput
    connect?: DepartmentWhereUniqueInput
  }

  export type DepartmentUpdateOneWithoutSpecialistsNestedInput = {
    create?: XOR<DepartmentCreateWithoutSpecialistsInput, DepartmentUncheckedCreateWithoutSpecialistsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutSpecialistsInput
    upsert?: DepartmentUpsertWithoutSpecialistsInput
    disconnect?: DepartmentWhereInput | boolean
    delete?: DepartmentWhereInput | boolean
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutSpecialistsInput, DepartmentUpdateWithoutSpecialistsInput>, DepartmentUncheckedUpdateWithoutSpecialistsInput>
  }

  export type TenantShiftRosterCreateNestedManyWithoutTemplateInput = {
    create?: XOR<TenantShiftRosterCreateWithoutTemplateInput, TenantShiftRosterUncheckedCreateWithoutTemplateInput> | TenantShiftRosterCreateWithoutTemplateInput[] | TenantShiftRosterUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: TenantShiftRosterCreateOrConnectWithoutTemplateInput | TenantShiftRosterCreateOrConnectWithoutTemplateInput[]
    createMany?: TenantShiftRosterCreateManyTemplateInputEnvelope
    connect?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
  }

  export type TenantShiftRosterUncheckedCreateNestedManyWithoutTemplateInput = {
    create?: XOR<TenantShiftRosterCreateWithoutTemplateInput, TenantShiftRosterUncheckedCreateWithoutTemplateInput> | TenantShiftRosterCreateWithoutTemplateInput[] | TenantShiftRosterUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: TenantShiftRosterCreateOrConnectWithoutTemplateInput | TenantShiftRosterCreateOrConnectWithoutTemplateInput[]
    createMany?: TenantShiftRosterCreateManyTemplateInputEnvelope
    connect?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
  }

  export type TenantShiftRosterUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<TenantShiftRosterCreateWithoutTemplateInput, TenantShiftRosterUncheckedCreateWithoutTemplateInput> | TenantShiftRosterCreateWithoutTemplateInput[] | TenantShiftRosterUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: TenantShiftRosterCreateOrConnectWithoutTemplateInput | TenantShiftRosterCreateOrConnectWithoutTemplateInput[]
    upsert?: TenantShiftRosterUpsertWithWhereUniqueWithoutTemplateInput | TenantShiftRosterUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: TenantShiftRosterCreateManyTemplateInputEnvelope
    set?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
    disconnect?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
    delete?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
    connect?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
    update?: TenantShiftRosterUpdateWithWhereUniqueWithoutTemplateInput | TenantShiftRosterUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: TenantShiftRosterUpdateManyWithWhereWithoutTemplateInput | TenantShiftRosterUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: TenantShiftRosterScalarWhereInput | TenantShiftRosterScalarWhereInput[]
  }

  export type TenantShiftRosterUncheckedUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<TenantShiftRosterCreateWithoutTemplateInput, TenantShiftRosterUncheckedCreateWithoutTemplateInput> | TenantShiftRosterCreateWithoutTemplateInput[] | TenantShiftRosterUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: TenantShiftRosterCreateOrConnectWithoutTemplateInput | TenantShiftRosterCreateOrConnectWithoutTemplateInput[]
    upsert?: TenantShiftRosterUpsertWithWhereUniqueWithoutTemplateInput | TenantShiftRosterUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: TenantShiftRosterCreateManyTemplateInputEnvelope
    set?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
    disconnect?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
    delete?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
    connect?: TenantShiftRosterWhereUniqueInput | TenantShiftRosterWhereUniqueInput[]
    update?: TenantShiftRosterUpdateWithWhereUniqueWithoutTemplateInput | TenantShiftRosterUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: TenantShiftRosterUpdateManyWithWhereWithoutTemplateInput | TenantShiftRosterUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: TenantShiftRosterScalarWhereInput | TenantShiftRosterScalarWhereInput[]
  }

  export type TenantShiftTemplateCreateNestedOneWithoutRostersInput = {
    create?: XOR<TenantShiftTemplateCreateWithoutRostersInput, TenantShiftTemplateUncheckedCreateWithoutRostersInput>
    connectOrCreate?: TenantShiftTemplateCreateOrConnectWithoutRostersInput
    connect?: TenantShiftTemplateWhereUniqueInput
  }

  export type TenantAttendanceCreateNestedOneWithoutRosterInput = {
    create?: XOR<TenantAttendanceCreateWithoutRosterInput, TenantAttendanceUncheckedCreateWithoutRosterInput>
    connectOrCreate?: TenantAttendanceCreateOrConnectWithoutRosterInput
    connect?: TenantAttendanceWhereUniqueInput
  }

  export type TenantAttendanceUncheckedCreateNestedOneWithoutRosterInput = {
    create?: XOR<TenantAttendanceCreateWithoutRosterInput, TenantAttendanceUncheckedCreateWithoutRosterInput>
    connectOrCreate?: TenantAttendanceCreateOrConnectWithoutRosterInput
    connect?: TenantAttendanceWhereUniqueInput
  }

  export type TenantShiftTemplateUpdateOneWithoutRostersNestedInput = {
    create?: XOR<TenantShiftTemplateCreateWithoutRostersInput, TenantShiftTemplateUncheckedCreateWithoutRostersInput>
    connectOrCreate?: TenantShiftTemplateCreateOrConnectWithoutRostersInput
    upsert?: TenantShiftTemplateUpsertWithoutRostersInput
    disconnect?: TenantShiftTemplateWhereInput | boolean
    delete?: TenantShiftTemplateWhereInput | boolean
    connect?: TenantShiftTemplateWhereUniqueInput
    update?: XOR<XOR<TenantShiftTemplateUpdateToOneWithWhereWithoutRostersInput, TenantShiftTemplateUpdateWithoutRostersInput>, TenantShiftTemplateUncheckedUpdateWithoutRostersInput>
  }

  export type TenantAttendanceUpdateOneWithoutRosterNestedInput = {
    create?: XOR<TenantAttendanceCreateWithoutRosterInput, TenantAttendanceUncheckedCreateWithoutRosterInput>
    connectOrCreate?: TenantAttendanceCreateOrConnectWithoutRosterInput
    upsert?: TenantAttendanceUpsertWithoutRosterInput
    disconnect?: TenantAttendanceWhereInput | boolean
    delete?: TenantAttendanceWhereInput | boolean
    connect?: TenantAttendanceWhereUniqueInput
    update?: XOR<XOR<TenantAttendanceUpdateToOneWithWhereWithoutRosterInput, TenantAttendanceUpdateWithoutRosterInput>, TenantAttendanceUncheckedUpdateWithoutRosterInput>
  }

  export type TenantAttendanceUncheckedUpdateOneWithoutRosterNestedInput = {
    create?: XOR<TenantAttendanceCreateWithoutRosterInput, TenantAttendanceUncheckedCreateWithoutRosterInput>
    connectOrCreate?: TenantAttendanceCreateOrConnectWithoutRosterInput
    upsert?: TenantAttendanceUpsertWithoutRosterInput
    disconnect?: TenantAttendanceWhereInput | boolean
    delete?: TenantAttendanceWhereInput | boolean
    connect?: TenantAttendanceWhereUniqueInput
    update?: XOR<XOR<TenantAttendanceUpdateToOneWithWhereWithoutRosterInput, TenantAttendanceUpdateWithoutRosterInput>, TenantAttendanceUncheckedUpdateWithoutRosterInput>
  }

  export type TenantShiftRosterCreateNestedOneWithoutAttendanceInput = {
    create?: XOR<TenantShiftRosterCreateWithoutAttendanceInput, TenantShiftRosterUncheckedCreateWithoutAttendanceInput>
    connectOrCreate?: TenantShiftRosterCreateOrConnectWithoutAttendanceInput
    connect?: TenantShiftRosterWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TenantShiftRosterUpdateOneWithoutAttendanceNestedInput = {
    create?: XOR<TenantShiftRosterCreateWithoutAttendanceInput, TenantShiftRosterUncheckedCreateWithoutAttendanceInput>
    connectOrCreate?: TenantShiftRosterCreateOrConnectWithoutAttendanceInput
    upsert?: TenantShiftRosterUpsertWithoutAttendanceInput
    disconnect?: TenantShiftRosterWhereInput | boolean
    delete?: TenantShiftRosterWhereInput | boolean
    connect?: TenantShiftRosterWhereUniqueInput
    update?: XOR<XOR<TenantShiftRosterUpdateToOneWithWhereWithoutAttendanceInput, TenantShiftRosterUpdateWithoutAttendanceInput>, TenantShiftRosterUncheckedUpdateWithoutAttendanceInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type AppointmentCreateWithoutPatientInput = {
    id?: string
    dateTime: Date | string
    status?: string
    reason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUncheckedCreateWithoutPatientInput = {
    id?: string
    dateTime: Date | string
    status?: string
    reason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateOrConnectWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentCreateManyPatientInputEnvelope = {
    data: AppointmentCreateManyPatientInput | AppointmentCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentUpsertWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutPatientInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutPatientInput>
  }

  export type AppointmentScalarWhereInput = {
    AND?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    OR?: AppointmentScalarWhereInput[]
    NOT?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    id?: StringFilter<"Appointment"> | string
    patientId?: StringFilter<"Appointment"> | string
    dateTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: StringFilter<"Appointment"> | string
    reason?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
  }

  export type PatientCreateWithoutAppointmentsInput = {
    id?: string
    firstName: string
    lastName: string
    email?: string | null
    phone?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    bloodGroup?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    firstName: string
    lastName: string
    email?: string | null
    phone?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    bloodGroup?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientCreateOrConnectWithoutAppointmentsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
  }

  export type PatientUpsertWithoutAppointmentsInput = {
    update: XOR<PatientUpdateWithoutAppointmentsInput, PatientUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutAppointmentsInput, PatientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PatientUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffCreateWithoutDepartmentInput = {
    id?: string
    firstName: string
    lastName: string
    designation: string
    specialization?: string | null
    email: string
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StaffUncheckedCreateWithoutDepartmentInput = {
    id?: string
    firstName: string
    lastName: string
    designation: string
    specialization?: string | null
    email: string
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StaffCreateOrConnectWithoutDepartmentInput = {
    where: StaffWhereUniqueInput
    create: XOR<StaffCreateWithoutDepartmentInput, StaffUncheckedCreateWithoutDepartmentInput>
  }

  export type StaffCreateManyDepartmentInputEnvelope = {
    data: StaffCreateManyDepartmentInput | StaffCreateManyDepartmentInput[]
    skipDuplicates?: boolean
  }

  export type StaffUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: StaffWhereUniqueInput
    update: XOR<StaffUpdateWithoutDepartmentInput, StaffUncheckedUpdateWithoutDepartmentInput>
    create: XOR<StaffCreateWithoutDepartmentInput, StaffUncheckedCreateWithoutDepartmentInput>
  }

  export type StaffUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: StaffWhereUniqueInput
    data: XOR<StaffUpdateWithoutDepartmentInput, StaffUncheckedUpdateWithoutDepartmentInput>
  }

  export type StaffUpdateManyWithWhereWithoutDepartmentInput = {
    where: StaffScalarWhereInput
    data: XOR<StaffUpdateManyMutationInput, StaffUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type StaffScalarWhereInput = {
    AND?: StaffScalarWhereInput | StaffScalarWhereInput[]
    OR?: StaffScalarWhereInput[]
    NOT?: StaffScalarWhereInput | StaffScalarWhereInput[]
    id?: StringFilter<"Staff"> | string
    firstName?: StringFilter<"Staff"> | string
    lastName?: StringFilter<"Staff"> | string
    designation?: StringFilter<"Staff"> | string
    specialization?: StringNullableFilter<"Staff"> | string | null
    departmentId?: StringNullableFilter<"Staff"> | string | null
    email?: StringFilter<"Staff"> | string
    phone?: StringNullableFilter<"Staff"> | string | null
    active?: BoolFilter<"Staff"> | boolean
    createdAt?: DateTimeFilter<"Staff"> | Date | string
    updatedAt?: DateTimeFilter<"Staff"> | Date | string
  }

  export type DepartmentCreateWithoutSpecialistsInput = {
    id?: string
    name: string
    code: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentUncheckedCreateWithoutSpecialistsInput = {
    id?: string
    name: string
    code: string
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentCreateOrConnectWithoutSpecialistsInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutSpecialistsInput, DepartmentUncheckedCreateWithoutSpecialistsInput>
  }

  export type DepartmentUpsertWithoutSpecialistsInput = {
    update: XOR<DepartmentUpdateWithoutSpecialistsInput, DepartmentUncheckedUpdateWithoutSpecialistsInput>
    create: XOR<DepartmentCreateWithoutSpecialistsInput, DepartmentUncheckedCreateWithoutSpecialistsInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutSpecialistsInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutSpecialistsInput, DepartmentUncheckedUpdateWithoutSpecialistsInput>
  }

  export type DepartmentUpdateWithoutSpecialistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentUncheckedUpdateWithoutSpecialistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantShiftRosterCreateWithoutTemplateInput = {
    id?: string
    staffId: string
    date: Date | string
    startTime: string
    endTime: string
    department: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendance?: TenantAttendanceCreateNestedOneWithoutRosterInput
  }

  export type TenantShiftRosterUncheckedCreateWithoutTemplateInput = {
    id?: string
    staffId: string
    date: Date | string
    startTime: string
    endTime: string
    department: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attendance?: TenantAttendanceUncheckedCreateNestedOneWithoutRosterInput
  }

  export type TenantShiftRosterCreateOrConnectWithoutTemplateInput = {
    where: TenantShiftRosterWhereUniqueInput
    create: XOR<TenantShiftRosterCreateWithoutTemplateInput, TenantShiftRosterUncheckedCreateWithoutTemplateInput>
  }

  export type TenantShiftRosterCreateManyTemplateInputEnvelope = {
    data: TenantShiftRosterCreateManyTemplateInput | TenantShiftRosterCreateManyTemplateInput[]
    skipDuplicates?: boolean
  }

  export type TenantShiftRosterUpsertWithWhereUniqueWithoutTemplateInput = {
    where: TenantShiftRosterWhereUniqueInput
    update: XOR<TenantShiftRosterUpdateWithoutTemplateInput, TenantShiftRosterUncheckedUpdateWithoutTemplateInput>
    create: XOR<TenantShiftRosterCreateWithoutTemplateInput, TenantShiftRosterUncheckedCreateWithoutTemplateInput>
  }

  export type TenantShiftRosterUpdateWithWhereUniqueWithoutTemplateInput = {
    where: TenantShiftRosterWhereUniqueInput
    data: XOR<TenantShiftRosterUpdateWithoutTemplateInput, TenantShiftRosterUncheckedUpdateWithoutTemplateInput>
  }

  export type TenantShiftRosterUpdateManyWithWhereWithoutTemplateInput = {
    where: TenantShiftRosterScalarWhereInput
    data: XOR<TenantShiftRosterUpdateManyMutationInput, TenantShiftRosterUncheckedUpdateManyWithoutTemplateInput>
  }

  export type TenantShiftRosterScalarWhereInput = {
    AND?: TenantShiftRosterScalarWhereInput | TenantShiftRosterScalarWhereInput[]
    OR?: TenantShiftRosterScalarWhereInput[]
    NOT?: TenantShiftRosterScalarWhereInput | TenantShiftRosterScalarWhereInput[]
    id?: StringFilter<"TenantShiftRoster"> | string
    staffId?: StringFilter<"TenantShiftRoster"> | string
    templateId?: StringNullableFilter<"TenantShiftRoster"> | string | null
    date?: DateTimeFilter<"TenantShiftRoster"> | Date | string
    startTime?: StringFilter<"TenantShiftRoster"> | string
    endTime?: StringFilter<"TenantShiftRoster"> | string
    department?: StringFilter<"TenantShiftRoster"> | string
    status?: StringFilter<"TenantShiftRoster"> | string
    notes?: StringNullableFilter<"TenantShiftRoster"> | string | null
    createdAt?: DateTimeFilter<"TenantShiftRoster"> | Date | string
    updatedAt?: DateTimeFilter<"TenantShiftRoster"> | Date | string
  }

  export type TenantShiftTemplateCreateWithoutRostersInput = {
    id?: string
    name: string
    department: string
    type: string
    startTime: string
    endTime: string
    breakDuration: string
    rule: string
    staffing: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantShiftTemplateUncheckedCreateWithoutRostersInput = {
    id?: string
    name: string
    department: string
    type: string
    startTime: string
    endTime: string
    breakDuration: string
    rule: string
    staffing: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantShiftTemplateCreateOrConnectWithoutRostersInput = {
    where: TenantShiftTemplateWhereUniqueInput
    create: XOR<TenantShiftTemplateCreateWithoutRostersInput, TenantShiftTemplateUncheckedCreateWithoutRostersInput>
  }

  export type TenantAttendanceCreateWithoutRosterInput = {
    id?: string
    staffId: string
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deviceInfo?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantAttendanceUncheckedCreateWithoutRosterInput = {
    id?: string
    staffId: string
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: string
    latitude?: number | null
    longitude?: number | null
    deviceInfo?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantAttendanceCreateOrConnectWithoutRosterInput = {
    where: TenantAttendanceWhereUniqueInput
    create: XOR<TenantAttendanceCreateWithoutRosterInput, TenantAttendanceUncheckedCreateWithoutRosterInput>
  }

  export type TenantShiftTemplateUpsertWithoutRostersInput = {
    update: XOR<TenantShiftTemplateUpdateWithoutRostersInput, TenantShiftTemplateUncheckedUpdateWithoutRostersInput>
    create: XOR<TenantShiftTemplateCreateWithoutRostersInput, TenantShiftTemplateUncheckedCreateWithoutRostersInput>
    where?: TenantShiftTemplateWhereInput
  }

  export type TenantShiftTemplateUpdateToOneWithWhereWithoutRostersInput = {
    where?: TenantShiftTemplateWhereInput
    data: XOR<TenantShiftTemplateUpdateWithoutRostersInput, TenantShiftTemplateUncheckedUpdateWithoutRostersInput>
  }

  export type TenantShiftTemplateUpdateWithoutRostersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakDuration?: StringFieldUpdateOperationsInput | string
    rule?: StringFieldUpdateOperationsInput | string
    staffing?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantShiftTemplateUncheckedUpdateWithoutRostersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakDuration?: StringFieldUpdateOperationsInput | string
    rule?: StringFieldUpdateOperationsInput | string
    staffing?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantAttendanceUpsertWithoutRosterInput = {
    update: XOR<TenantAttendanceUpdateWithoutRosterInput, TenantAttendanceUncheckedUpdateWithoutRosterInput>
    create: XOR<TenantAttendanceCreateWithoutRosterInput, TenantAttendanceUncheckedCreateWithoutRosterInput>
    where?: TenantAttendanceWhereInput
  }

  export type TenantAttendanceUpdateToOneWithWhereWithoutRosterInput = {
    where?: TenantAttendanceWhereInput
    data: XOR<TenantAttendanceUpdateWithoutRosterInput, TenantAttendanceUncheckedUpdateWithoutRosterInput>
  }

  export type TenantAttendanceUpdateWithoutRosterInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantAttendanceUncheckedUpdateWithoutRosterInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantShiftRosterCreateWithoutAttendanceInput = {
    id?: string
    staffId: string
    date: Date | string
    startTime: string
    endTime: string
    department: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    template?: TenantShiftTemplateCreateNestedOneWithoutRostersInput
  }

  export type TenantShiftRosterUncheckedCreateWithoutAttendanceInput = {
    id?: string
    staffId: string
    templateId?: string | null
    date: Date | string
    startTime: string
    endTime: string
    department: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantShiftRosterCreateOrConnectWithoutAttendanceInput = {
    where: TenantShiftRosterWhereUniqueInput
    create: XOR<TenantShiftRosterCreateWithoutAttendanceInput, TenantShiftRosterUncheckedCreateWithoutAttendanceInput>
  }

  export type TenantShiftRosterUpsertWithoutAttendanceInput = {
    update: XOR<TenantShiftRosterUpdateWithoutAttendanceInput, TenantShiftRosterUncheckedUpdateWithoutAttendanceInput>
    create: XOR<TenantShiftRosterCreateWithoutAttendanceInput, TenantShiftRosterUncheckedCreateWithoutAttendanceInput>
    where?: TenantShiftRosterWhereInput
  }

  export type TenantShiftRosterUpdateToOneWithWhereWithoutAttendanceInput = {
    where?: TenantShiftRosterWhereInput
    data: XOR<TenantShiftRosterUpdateWithoutAttendanceInput, TenantShiftRosterUncheckedUpdateWithoutAttendanceInput>
  }

  export type TenantShiftRosterUpdateWithoutAttendanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    template?: TenantShiftTemplateUpdateOneWithoutRostersNestedInput
  }

  export type TenantShiftRosterUncheckedUpdateWithoutAttendanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateManyPatientInput = {
    id?: string
    dateTime: Date | string
    status?: string
    reason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    dateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffCreateManyDepartmentInput = {
    id?: string
    firstName: string
    lastName: string
    designation: string
    specialization?: string | null
    email: string
    phone?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StaffUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    specialization?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffUncheckedUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    specialization?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffUncheckedUpdateManyWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    specialization?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantShiftRosterCreateManyTemplateInput = {
    id?: string
    staffId: string
    date: Date | string
    startTime: string
    endTime: string
    department: string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantShiftRosterUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance?: TenantAttendanceUpdateOneWithoutRosterNestedInput
  }

  export type TenantShiftRosterUncheckedUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendance?: TenantAttendanceUncheckedUpdateOneWithoutRosterNestedInput
  }

  export type TenantShiftRosterUncheckedUpdateManyWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    department?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}