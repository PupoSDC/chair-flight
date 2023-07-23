
import { router } from './config/trpc';
import { questionReviewRouter } from './routers/question-review';

export const appRouter = router({
    questionReview: questionReviewRouter,
});

export type AppRouter = typeof appRouter;