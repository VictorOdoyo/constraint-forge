/** Reversible Map updates. Domain arrays are immutable snapshots. */
export class Trail {
  constructor(domains) { this.domains = domains; this.changes = []; }
  mark() { return this.changes.length; }
  set(key, value) { this.changes.push([key, this.domains.get(key)]); this.domains.set(key, value); }
  undo(mark) {
    if (!Number.isInteger(mark) || mark < 0 || mark > this.changes.length) throw new RangeError('Invalid trail mark');
    while (this.changes.length > mark) { const [key, value] = this.changes.pop(); this.domains.set(key, value); }
  }
}
