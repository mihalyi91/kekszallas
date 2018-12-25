export class Feedback {
    constructor(public id: number, public name: string, public feedbacks: FeedbackEntry[]) {
    }
}

export class FeedbackEntry {
    constructor(public feedbackText: string, public feedbackType: number,
         public name: string, public date: string, public visitDate: string) {
    }
}

export interface FeedbackResponse {
  feedback: Feedback;
}
