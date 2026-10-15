ARG NODE_IMAGE
FROM ${NODE_IMAGE}

LABEL org.opencontainers.image.title="Goldlevel private factual record service" \
      org.opencontainers.image.description="Code only; evidence and credentials are read-only runtime mounts."

ENV NODE_ENV=production PORT=8080 HOST=0.0.0.0
WORKDIR /app
COPY --chown=0:0 package.json LICENSE ./
COPY --chown=0:0 src ./src
COPY --chown=0:0 public ./public
COPY --chown=0:0 policy ./policy
USER 10001:10001
EXPOSE 8080
CMD ["node", "src/server.mjs"]
