import asyncio
import time
from datetime import datetime
from typing import Dict, Any, Callable, Coroutine


class SimpleScheduler:
    _instance = None
    _running = False
    _tasks = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SimpleScheduler, cls).__new__(cls)
            cls._instance._tasks = {}
            cls._instance._running = False
        return cls._instance

    def start(self):
        """Start the scheduler"""
        self._running = True
        print("Simple scheduler started")

    def stop(self):
        """Stop the scheduler"""
        self._running = False

        # Cancel all running tasks
        for task_id, task in list(self._tasks.items()):
            if not task.done():
                task.cancel()
        self._tasks = {}
        print("Simple scheduler stopped")

    def schedule_task(
            self,
            task_id: str,
            coroutine_func: Callable[[], Coroutine],
            interval_minutes: int
    ):
        """Schedule a task to run at fixed intervals"""
        # Cancel existing task if it exists
        if task_id in self._tasks and not self._tasks[task_id].done():
            self._tasks[task_id].cancel()

        # Create new task
        async def _run_task_periodically():
            while self._running:
                try:
                    start_time = time.time()

                    # Execute the task
                    await coroutine_func()

                    # Calculate sleep time
                    elapsed = time.time() - start_time
                    sleep_time = max(0, interval_minutes * 60 - elapsed)

                    # Sleep until next execution
                    await asyncio.sleep(sleep_time)

                except asyncio.CancelledError:
                    # Handle task cancellation
                    break
                except Exception as e:
                    print(f"Error in scheduled task {task_id}: {str(e)}")
                    # Wait a bit before retrying to avoid tight loop on errors
                    await asyncio.sleep(10)

        # Start the task and store its reference
        self._tasks[task_id] = asyncio.create_task(_run_task_periodically())
        print(f"Scheduled task {task_id} to run every {interval_minutes} minutes")