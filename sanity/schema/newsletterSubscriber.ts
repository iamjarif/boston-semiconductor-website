import { defineField, defineType } from "sanity";

export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "unsubscribedAt",
      title: "Unsubscribed At",
      type: "datetime",
      description: "Set when the subscriber opts out of blog update emails.",
    }),
  ],
  preview: {
    select: { email: "email", subscribedAt: "subscribedAt", unsubscribedAt: "unsubscribedAt" },
    prepare({ email, subscribedAt, unsubscribedAt }) {
      const status = unsubscribedAt ? "Unsubscribed" : "Active";
      return {
        title: email ?? "Subscriber",
        subtitle: [status, subscribedAt ? new Date(subscribedAt).toLocaleDateString() : null]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
