import { EventEmitter } from 'events';

export interface AppEvents {
  'task.created': {
    taskId: string;
    userId: string;
    title: string;
    assigneeId: string;
  };
  'task.assigned': {
    taskId: string;
    userId: string;
    title: string;
    assigneeId: string;
  };
  'project.updated': {
    projectId: string;
    userId: string;
    title: string;
    changeDetails: string;
  };
  'invoice.paid': { invoiceId: string; userId: string; amount: string };
  'user.joined': { userId: string; name: string };
}

class TypedEventBus extends EventEmitter {
  emit<T extends keyof AppEvents>(event: T, payload: AppEvents[T]): boolean {
    return super.emit(event, payload);
  }

  on<T extends keyof AppEvents>(
    event: T,
    listener: (payload: AppEvents[T]) => void,
  ): this {
    return super.on(event, listener);
  }

  off<T extends keyof AppEvents>(
    event: T,
    listener: (payload: AppEvents[T]) => void,
  ): this {
    return super.off(event, listener);
  }
}

export const eventBus = new TypedEventBus();
