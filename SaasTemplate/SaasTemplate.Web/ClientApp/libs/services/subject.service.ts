// Angular modules
import { Injectable } from '@angular/core';

// Third-party modules
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SubjectService {
  private subjects: Map<string, BehaviorSubject<any>> = new Map();

  // Public methods

  public createSubject<T>(key: string, initialValue: T): void {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<T>(initialValue));
    } else {
      console.error(`Subject with key '${key}' already exists.`);
    }
  }

  public getSubject<T>(key: string): Observable<T> {
    const subject = this.subjects.get(key);
    if (!subject) {
      throw new Error(`Subject with key '${key}' does not exist.`);
    }
    return subject.asObservable();
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
