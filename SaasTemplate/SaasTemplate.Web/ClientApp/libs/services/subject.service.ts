// Angular modules
import { Injectable } from '@angular/core';

// Third-party modules
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SubjectService {
  private subjects = new Map<string, BehaviorSubject<unknown>>();

  // Public methods

  public createSubject<T>(key: string, initialValue: T): void {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<unknown>(initialValue));
    } else {
      console.error(`Subject with key '${key}' already exists.`);
    }
  }

  public getSubject<T>(key: string): Observable<T> {
    const subject = this.subjects.get(key);
    if (!subject) {
      throw new Error(`Subject with key '${key}' does not exist.`);
    }
    return subject.asObservable() as Observable<T>;
  }

  public updateSubjectValue<T>(key: string, newValue: T): void {
    const subject = this.subjects.get(key);
    if (!subject) {
      throw new Error(`Subject with key '${key}' does not exist.`);
    }
    subject.next(newValue);
  }

  public flushSubjects() {
    this.subjects = new Map();
  }
}
