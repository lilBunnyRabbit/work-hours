export type TimeNumber = `${number}` | `0${number}`;

export type TimeString = `${TimeNumber}:${TimeNumber}:${TimeNumber}`;

export type TimeShortString = `${TimeNumber}:${TimeNumber}`;

export type TimeObject = {
  hours: number;
  minutes: number;
  seconds?: number;
};

function parseTimeString(value: TimeShortString | TimeString): Required<TimeObject> {
  const [hours, minutes, seconds] = value.split(":");

  if (Number.isNaN(hours)) throw new Error("Invalid hours.");
  if (Number.isNaN(minutes)) throw new Error("Invalid minutes.");
  if (seconds) {
    if (Number.isNaN(seconds)) throw new Error("Invalid seconds.");

    return {
      hours: Number.parseInt(hours),
      minutes: Number.parseInt(minutes),
      seconds: Number.parseInt(seconds),
    };
  }

  return {
    hours: Number.parseInt(hours),
    minutes: Number.parseInt(minutes),
    seconds: 0,
  };
}

function padNumber(value: number): TimeNumber {
  return String(value).padStart(2, "0") as TimeNumber;
}

export class TimeDuration {
  private _hours: number = 0;
  private _minutes: number = 0;
  private _seconds: number = 0;

  constructor(hours: number, minutes: number, seconds: number = 0) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  static from(value: TimeShortString | TimeString | TimeObject) {
    const parsed = typeof value === "string" ? parseTimeString(value) : value;
    return new TimeDuration(parsed.hours, parsed.minutes, parsed.seconds);
  }

  get hours() {
    return this._hours;
  }

  get minutes() {
    return this._minutes;
  }

  get seconds() {
    return this._seconds;
  }

  set hours(hours: number) {
    if (hours < 0) {
      this._hours = 0;
      this._minutes = 0;
      this._seconds = 0;
    } else {
      this._hours = hours;
    }
  }

  set minutes(minutes: number) {
    if (minutes < 0) {
      this._minutes = 60 - (Math.abs(minutes) % 60);
      this.hours += Math.floor(minutes / 60);
    } else if (minutes < 60) {
      this._minutes = minutes;
    } else {
      this._minutes = minutes % 60;
      this.hours += Math.floor(minutes / 60);
    }
  }

  set seconds(seconds: number) {
    if (seconds < 0) {
      this._seconds = 60 - (Math.abs(seconds) % 60);
      this.minutes += Math.floor(seconds / 60);
    } else if (seconds < 60) {
      this._seconds = seconds;
    } else {
      this._seconds = seconds % 60;
      this.minutes += Math.floor(seconds / 60);
    }
  }

  public set(value: TimeShortString | TimeString | TimeObject) {
    const parsed = typeof value === "string" ? parseTimeString(value) : value;

    this.hours = parsed.hours;
    this.minutes = parsed.minutes;
    if (parsed.seconds !== undefined) this.seconds = parsed.seconds;

    return this;
  }

  public toString(): TimeString {
    return `${padNumber(this.hours)}:${padNumber(this.minutes)}:${padNumber(this.seconds)}`;
  }

  public toShortString(): TimeShortString {
    return `${padNumber(this.hours)}:${padNumber(this.minutes)}`;
  }

  public toJSON(): Required<TimeObject> {
    return {
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
    };
  }
}

export class TimeValue {
  static MAX_SECONDS = 24 * 60 * 60;

  private _hours: number = 0;
  private _minutes: number = 0;
  private _seconds: number = 0;

  constructor(hours: number, minutes: number, seconds: number = 0) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  static from(value: TimeShortString | TimeString | TimeObject) {
    const parsed = typeof value === "string" ? parseTimeString(value) : value;
    return new TimeValue(parsed.hours, parsed.minutes, parsed.seconds);
  }

  static now() {
    const date = new Date();
    return new TimeValue(date.getHours(), date.getMinutes(), date.getSeconds());
  }

  static toSeconds(value: TimeValue | TimeShortString | TimeString | TimeObject) {
    const timeValue = value instanceof TimeValue ? value : TimeValue.from(value);
    return (timeValue.hours * 60 + timeValue.minutes) * 60 + timeValue.seconds;
  }

  static duration(
    from: TimeValue | TimeShortString | TimeString | TimeObject,
    to: TimeValue | TimeShortString | TimeString | TimeObject
  ): TimeDuration {
    const fromSeconds = TimeValue.toSeconds(from);
    const toSeconds = TimeValue.toSeconds(to);

    let difference = 0;
    if (toSeconds > fromSeconds) {
      difference = toSeconds - fromSeconds;
    } else {
      difference = TimeValue.MAX_SECONDS - fromSeconds + toSeconds;
      if (difference === TimeValue.MAX_SECONDS) difference = 0;
    }

    const seconds = Math.abs(difference);
    const minutes = Math.floor(seconds / 60);

    return new TimeDuration(Math.floor(minutes / 60), minutes % 60, seconds % 60);
  }

  get hours() {
    return this._hours;
  }

  get minutes() {
    return this._minutes;
  }

  get seconds() {
    return this._seconds;
  }

  set hours(hours: number) {
    if (hours < 0) {
      this._hours = 24 - (Math.abs(hours) % 24);
    } else if (hours < 24) {
      this._hours = hours;
    } else {
      this._hours = hours % 24;
    }
  }

  set minutes(minutes: number) {
    if (minutes < 0) {
      this._minutes = 60 - (Math.abs(minutes) % 60);
      this.hours += Math.floor(minutes / 60);
    } else if (minutes < 60) {
      this._minutes = minutes;
    } else {
      this._minutes = minutes % 60;
      this.hours += Math.floor(minutes / 60);
    }
  }

  set seconds(seconds: number) {
    if (seconds < 0) {
      this._seconds = 60 - (Math.abs(seconds) % 60);
      this.minutes += Math.floor(seconds / 60);
    } else if (seconds < 60) {
      this._seconds = seconds;
    } else {
      this._seconds = seconds % 60;
      this.minutes += Math.floor(seconds / 60);
    }
  }

  public set(value: TimeShortString | TimeString | TimeObject) {
    const parsed = typeof value === "string" ? parseTimeString(value) : value;

    this.hours = parsed.hours;
    this.minutes = parsed.minutes;
    if (parsed.seconds !== undefined) this.seconds = parsed.seconds;

    return this;
  }

  public durationFrom(from: TimeValue | TimeShortString | TimeString | TimeObject): TimeDuration {
    return TimeValue.duration(from, this);
  }

  public durationTo(to: TimeValue | TimeShortString | TimeString | TimeObject): TimeDuration {
    return TimeValue.duration(this, to);
  }

  public toString(): TimeString {
    return `${padNumber(this.hours)}:${padNumber(this.minutes)}:${padNumber(this.seconds)}`;
  }

  public toShortString(): TimeShortString {
    return `${padNumber(this.hours)}:${padNumber(this.minutes)}`;
  }

  public toJSON(): Required<TimeObject> {
    return {
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
    };
  }
}
