import { FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Link, Sheet, Typography } from "@mui/joy";
import { z } from "zod";
import { HookFormInput } from "./hook-form-input";
import { HookFormTextArea } from "./hook-form-textarea";
import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta = {
  title: "Components/Hook Form Components",
};

/**
 * Uses the `HookFormInput` input component. The only difference in usage
 * between this component and a raw `<input />` is that we need to provide the
 * errors object coming from the hook form.
 */
export const ExampleLoginForm: StoryFn = () => {
  const resolver = zodResolver(
    z.object({
      userName: z.string().email(),
      password: z.string().min(8),
    }),
  );

  const defaultValues = {
    userName: "",
    password: "",
  };

  const form = useForm({ resolver, defaultValues });

  const onSubmit = form.handleSubmit((data) => {
    alert(`Success! ${data.userName}`);
  });

  return (
    <Sheet
      sx={{
        width: 300,
        mx: "auto",
        my: 4,
        py: 3,
        px: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "sm",
        boxShadow: "md",
      }}
      variant="outlined"
      component={"form"}
      onSubmit={onSubmit}
    >
      <FormProvider {...form}>
        <div>
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-sm">Sign in to continue.</Typography>
        </div>
        <HookFormInput
          {...form.register("userName")}
          formLabel="Email"
          placeholder="Email"
        />
        <HookFormInput
          {...form.register("password")}
          formLabel="Password"
          type="password"
          placeholder="Password"
        />
        <Button sx={{ mt: 1 }} type="submit">
          Log in
        </Button>
        <Typography
          endDecorator={<Link href="#">Sign up</Link>}
          fontSize="sm"
          sx={{ alignSelf: "center" }}
        >
          Don&apos;t have an account?
        </Typography>
        <DevTool {...form} />
      </FormProvider>
    </Sheet>
  );
};

export const ExampleTextArea: StoryFn = () => {
  const resolver = zodResolver(
    z.object({
      text: z.string(),
    }),
  );
  const defaultValues = {
    text: "",
  };

  const form = useForm({ resolver, defaultValues });

  const onSubmit = form.handleSubmit((data) => {
    alert(`Success! ${data.text}`);
  });

  return (
    <Sheet component={"form"} onSubmit={onSubmit}>
      <FormProvider {...form}>
        <HookFormTextArea {...form.register("text")} />
        <Button sx={{ mt: 1 }} type="submit">
          Log in
        </Button>
      </FormProvider>
      <DevTool {...form} />
    </Sheet>
  );
};

export default meta;
